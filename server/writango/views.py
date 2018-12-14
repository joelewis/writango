# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.shortcuts import render
from django.views.static import serve
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.forms.models import model_to_dict
from django.core import serializers
from django.core.exceptions import SuspiciousOperation, ObjectDoesNotExist
from models import *
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator


anonymous_draft_limit = 5

def index(request):
    return serve(request, 'index.html', document_root=settings.STATIC_ROOT)

def serve_static(request, path):
    path = 'index.html' if path is "" else path # redirect to index.html if no path specified
    return serve(request, path, document_root=settings.STATIC_ROOT, show_indexes=True)

def get_session(request):
    # user_dict = model_to_dict(request.user)
    if request.user.is_authenticated():
        user_id = request.user.id
        username = request.user.username
        email = request.user.email
        anonymous = False
    else:
        if not request.session.session_key:
            request.session.save()

        user_id = request.session.session_key
        username = request.session.session_key
        email = ""
        anonymous = True
    
    return JsonResponse({
        "session_key": request.session.session_key,
        "user": {
            "id": user_id,
            "username": username,
            "email": email,
            "anonymous": anonymous
        }
    })


def create_draft(request):
    if request.user.is_authenticated():
        # create post with user as author
        post = Post(user=request.user, title="Untitled Post")
    else:
        # ensure max_post_limit is not reached
        posts_by_session = Post.objects.filter(session=request.session.session_key)
        if posts_by_session.count() >= anonymous_draft_limit:
            raise SuspiciousOperation("Sorry, Max limit reached for anonymous session post creation!") 
        # create post with session
        post = Post(session=request.session.session_key, title="Untitled Post")
        
    post.save()
    posts = json.loads(serializers.serialize("json", [post]))
    return HttpResponse(json.dumps(posts[0]), content_type="application/json")

def publish_draft(request, id):
    post = Post.objects.filter(id=id)

    if not post.exists():
        raise ObjectDoesNotExist("Please check post id")

    post = post.first()
    if post.author != request.user and post.session != request.session.session_key:
        raise SuspiciousOperation('Invalid Authorization')

    post.is_published = True
    post.save()
    return JsonResponse({"published": True})


# util
def get_posts_for_username(request, username=None):
    # username can be none, session_id, or username
    # query by all
    user = request.user
    if username is None:
        # get posts of current user
        posts = Post.objects.filter(author=user) if user.is_authenticated() else Post.objects.filter(session=request.session.session_key)
    else:
        # query by session or user
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            posts = Post.objects.filter(author=user)
        else:
            posts = Post.objects.filter(session=username)
    return posts

def get_posts(request, username=None):
    authorize_user(request, username)
    current_page = request.GET.get('page') or "1"
    current_page = int(current_page)
    posts = get_posts_for_username(request, username)
    posts = posts.filter(is_published=True)
    pages = Paginator(posts, 5)
    # import pdb; pdb.set_trace()
    page = pages.page(current_page)
    posts = json.loads(serializers.serialize("json", page.object_list))
    return HttpResponse(json.dumps({
        "posts": posts, 
        "num_pages": pages.num_pages,
        "current_page": current_page
    }), content_type="application/json")


def user_exists(username):
    if User.objects.filter(username=username).exists():
        return True
    return False

def authorize_user(request, username):
    if (user_exists(username)):
        if not request.user.is_authenticated() or request.user.username is not username:
            raise SuspiciousOperation('Invalid Authorization')
    else:
        if username != request.session.session_key:
            raise SuspiciousOperation('Invalid Authorization')

def get_drafts(request, username=None):
    authorize_user(request, username)
    current_page = request.GET.get('page') or "1"
    current_page = int(current_page)
    posts = get_posts_for_username(request, username)
    posts = posts.filter(is_published=False)
    pages = Paginator(posts, 5)
    # import pdb; pdb.set_trace()
    page = pages.page(current_page)
    posts = json.loads(serializers.serialize("json", page.object_list))
    return HttpResponse(json.dumps({
        "posts": posts, 
        "num_pages": pages.num_pages,
        "current_page": current_page
    }), content_type="application/json")


def get_post(request, username, slug):
    posts = get_posts_for_username(request, username)
    posts = posts.filter(slug=slug)
    if not posts.exists():
        raise ObjectDoesNotExist("Please check post id")
    posts = json.loads(serializers.serialize("json", posts))
    post = posts[0]
    return JsonResponse(post)

@csrf_exempt
def update_post(request, username, slug):
    authorize_user(request, username)
    if request.method == 'POST':
        postJSON = json.loads(request.body)
        post = Post.objects.get(slug=slug)
        if post.author != request.user and post.session != request.session.session_key:
            raise SuspiciousOperation('Invalid Authorization')
        
        post.title = postJSON["fields"]["title"]
        post.text = json.dumps(postJSON["fields"]["text"])
        post.save()

        posts = json.loads(serializers.serialize("json", [post]))
        post = posts[0]
        return JsonResponse(post)
    

def delete_post(request, id):
    post = Post.objects.get(id=id)
    if post.author != request.user and post.session != request.session.session_key:
        raise SuspiciousOperation('Invalid Authorization')
        
    post.delete()
    return JsonResponse({"deleted": True})


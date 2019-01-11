# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.template import loader
from django.shortcuts import render
from django.views.static import serve
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.conf import settings
from django.forms.models import model_to_dict
from django.core import serializers
from django.core.exceptions import SuspiciousOperation, ObjectDoesNotExist
from writango.models import *
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from Crypto.Cipher import XOR
import base64


anonymous_draft_limit = 5


def encrypt(key, plaintext):
  cipher = XOR.new(key)
  return base64.b64encode(cipher.encrypt(plaintext))

def decrypt(key, encryptedtext):
  cipher = XOR.new(key)
  return cipher.decrypt(base64.b64decode(encryptedtext))

def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({
        "STATIC_HOST": settings.STATIC_HOST
    }, request))

def serve_static(request, path):
    path = 'index.html' if path is "" else path # redirect to index.html if no path specified
    return serve(request, path, document_root=settings.STATIC_ROOT, show_indexes=True)

@csrf_exempt
def writango_login(request):
    email = request.POST.get('email')
    password = request.POST.get('password')
    user = User.objects.filter(email=email)
    if not user.exists():
        return HttpResponse(json.dumps({"error": "We cannot find the account associated with that email."}), content_type="application/json", status=400)
    user = user.first()
    valid_password = user.check_password(password)
    if not valid_password:
        return HttpResponse(json.dumps({"error": "Incorrect password."}), content_type="application/json", status=400)
    login(request, user)
    return HttpResponse(json.dumps({"success": "user logged in", "username": user.username}), content_type="application/json")


@csrf_exempt
def writango_register(request):
    email = request.POST.get('email')
    password = request.POST.get('password')
    username = email.split('@')[0]

    username_taken = User.objects.filter(username=username).exists()
    email_taken = User.objects.filter(email=email).exists()
    if email_taken:
        return HttpResponse(json.dumps({"error": "Email already registered with an existing account."}), content_type="application/json", status=400)
    if username_taken:
        username = username + '-' + User.objects.make_random_password(length=5, allowed_chars='123456789')

    # get all posts by this session
    session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
    posts = Post.objects.filter(session=session_key)
    user = User(email=email, password=password, username=username)
    user.save()
    login(request, user)
    # set user as author for all posts in his session
    for post in posts:
        post.author = user
        post.save() # TODO: find a more efficient way to save excess db ops
    return HttpResponse(json.dumps({"success": "user registered", "username": user.username}), content_type="application/json")

def writango_logout(request):
    logout(request)
    return HttpResponseRedirect('/')

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

        session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
        user_id = session_key
        username = session_key
        email = ""
        anonymous = True
    
    return JsonResponse({
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
        post = Post(author=request.user, title="Untitled Post")
    else:
        # ensure max_post_limit is not reached
        session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
        posts_by_session = Post.objects.filter(session=session_key)
        if posts_by_session.count() >= anonymous_draft_limit:
            raise SuspiciousOperation("Sorry, Max limit reached for anonymous session post creation!") 
        # create post with session
        post = Post(session=session_key, title="Untitled Post")
        
    post.save()
    posts = json.loads(serializers.serialize("json", [post]))
    post = posts[0]

    if post["fields"]["author"] != None:
        author = User.objects.get(id=post["fields"]["author"])
        post["fields"]["author"] = {
            "id": author.id,
            "username": author.username
        }
    return HttpResponse(json.dumps(post), content_type="application/json")

def publish_draft(request, id):
    post = Post.objects.filter(id=id)

    if not post.exists():
        raise ObjectDoesNotExist("Please check post id")

    post = post.first()
    session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
    if post.author != request.user and post.session != session_key:
        raise SuspiciousOperation('Invalid Authorization')

    post.is_published = True
    post.save(reslug=True)
    return JsonResponse({"published": True})


# util
def get_posts_for_username(request, username=None):
    # username can be none, session_id, or username
    # query by all
    user = request.user
    if username is None:
        # get posts of current user
        session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
        posts = Post.objects.filter(author=user) if user.is_authenticated() else Post.objects.filter(session=session_key)
    else:
        # query by session or user
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            posts = Post.objects.filter(author=user)
        else:
            posts = Post.objects.filter(session=username)
    return posts

def get_posts(request, username=None):
    # authorize_user(request, username)
    current_page = request.GET.get('page') or "1"
    current_page = int(current_page)
    posts = get_posts_for_username(request, username)
    posts = posts.filter(is_published=True).order_by('-modified_date')
    pages = Paginator(posts, 5)
    page = pages.page(current_page)
    posts = json.loads(serializers.serialize("json", page.object_list))

    for p in posts:
        if p["fields"]["author"] != None:
            author = User.objects.get(id=p["fields"]["author"])
            p["fields"]["author"] = {
                "id": author.id,
                "username": author.username
            }
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
        if not request.user.is_authenticated() and request.user.username is not username:
            raise SuspiciousOperation('Invalid Authorization')
    else:
        session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
        if username != session_key:
            raise SuspiciousOperation('Invalid Authorization')

def get_drafts(request, username=None):
    authorize_user(request, username)
    current_page = request.GET.get('page') or "1"
    current_page = int(current_page)
    posts = get_posts_for_username(request, username)
    posts = posts.filter(is_published=False).order_by('-modified_date')
    pages = Paginator(posts, 5)
    page = pages.page(current_page)
    posts = json.loads(serializers.serialize("json", page.object_list))
    for p in posts:
        if p["fields"]["author"] != None:
            author = User.objects.get(id=p["fields"]["author"])
            p["fields"]["author"] = {
                "id": author.id,
                "username": author.username
            }
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
    
    # authorize
    post = posts[0]
    session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
    if not post.is_published and post.author != request.user and post.session != session_key:
        # if draft state post: ensure only post.author or post.session can access
        raise SuspiciousOperation('Invalid Authorization')

    posts = json.loads(serializers.serialize("json", posts))
    post = posts[0]
    return JsonResponse(post)

@csrf_exempt
def update_post(request, username, slug):
    authorize_user(request, username)
    if request.method == 'POST':
        postJSON = json.loads(request.body)
        post = Post.objects.get(slug=slug)
        session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
        if post.author != request.user and post.session != session_key:
            raise SuspiciousOperation('Invalid Authorization')
        
        post.title = postJSON["fields"]["title"]
        post.text = json.dumps(postJSON["fields"]["text"])
        post.save()

        posts = json.loads(serializers.serialize("json", [post]))
        post = posts[0]
        return JsonResponse(post)
    

def delete_post(request, id):
    post = Post.objects.get(id=id)
    session_key = encrypt(settings.SECRET_KEY, request.session.session_key)
    if post.author != request.user and post.session != session_key:
        raise SuspiciousOperation('Invalid Authorization')
        
    post.delete()
    return JsonResponse({"deleted": True})


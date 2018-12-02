# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.static import serve
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.forms.models import model_to_dict



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
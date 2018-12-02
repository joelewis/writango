# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.static import serve
from django.http import HttpResponse
from django.conf import settings


def index(request):
    return serve(request, 'index.html', document_root=settings.STATIC_ROOT)

def serve_static(request, path):
    path = 'index.html' if path is "" else path # redirect to index.html if no path specified
    return serve(request, path, document_root=settings.STATIC_ROOT, show_indexes=True)
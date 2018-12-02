"""writango_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from writango import views as writango_views
from django.conf import settings
# from django.contrib.staticfiles.views import serve
from django.views.static import serve


# print static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^static/(?P<path>.*)$', writango_views.serve_static),
    url(r'^(?P<path>.*)$', writango_views.serve_static),
    # url(r'^writes/@(?P<username>.+)'),
    # url(r'^writes/@(?P<username>.+)/drafts$'),
    # url(r'^writes/@(?P<username>.+)/edit/(?P<post>.+)$'),
    # url(r'^writes/@(?P<username>.+)/posts/(?P<post>.+)$'),
]
# if settings.DEBUG:
#     urlpatterns += [url(r'^static/(?P<path>.*)$', writango_views.serve_static)]
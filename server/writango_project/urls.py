"""writango_project URL Configuration
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
    url(r'^login/', writango_views.writango_login),
    url(r'^register/', writango_views.writango_register),
    url(r'^logout/', writango_views.writango_logout),
    url(r'^session/get$', writango_views.get_session),
    url(r'^create/draft$', writango_views.create_draft), # TODO: GET URL UGLY. MAKE IT POST.
    url(r'^posts/$', writango_views.get_posts),
    url(r'^drafts$', writango_views.get_drafts),
    url(r'^posts/@(?P<username>.+)/(?P<slug>.+)$', writango_views.get_post),
    url(r'^drafts/@(?P<username>.+)/edit/(?P<slug>.+)$', writango_views.update_post),
    url(r'^posts/(?P<id>.+)/delete$', writango_views.delete_post),
    url(r'^drafts/(?P<id>.+)/publish$', writango_views.publish_draft),
    url(r'^posts/@(?P<username>.+)$', writango_views.get_posts),
    url(r'^drafts/@(?P<username>.+)$', writango_views.get_drafts),
    url(r'^writango/static/(?P<path>.*)$', writango_views.serve_static),
    url(r'^writes/.+$', writango_views.index),
    url(r'^$', writango_views.index),

    # url(r'^writes/@(?P<username>.+)'),
    # url(r'^writes/@(?P<username>.+)/drafts$'),
    # url(r'^writes/@(?P<username>.+)/edit/(?P<post>.+)$'),
    # url(r'^writes/@(?P<username>.+)/posts/(?P<post>.+)$'),
]
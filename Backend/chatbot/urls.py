from django.urls import path
from .views import QAView

urlpatterns = [
    path('qa/', view=QAView.as_view(), name='qa-view')
]

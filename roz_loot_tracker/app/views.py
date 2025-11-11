from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

from app.models import Player, Raid, RaidAttendance




class PlayerListView(ListView):
    model = Player
    template_name = 'player/player_list.html'
    context_object_name = 'players'


class PlayerDetailView(DetailView):
    model = Player
    template_name = 'player/player_detail.html'


class PlayerCreateView(CreateView):
    model = Player
    template_name = 'player/player_create.html'
    fields = '__all__'
    success_url = reverse_lazy('player-list')


class PlayerUpdateView(UpdateView):
    model = Player
    template_name = 'player/player_update.html'
    fields = '__all__'
    success_url = reverse_lazy('player-list')


class RaidListView(ListView):
    model = Raid
    template_name = 'raid/raid_list.html'
    context_object_name = 'raids'


class RaidDetailView(DetailView):
    model = Raid
    template_name = 'raid/raid_detail.html'


class RaidCreateView(CreateView):
    model = Raid
    template_name = 'raid/raid_create.html'
    fields = '__all__'
    success_url = reverse_lazy('raid-list')


class RaidUpdateView(UpdateView):
    model = Raid
    template_name = 'raid/raid_update.html'
    fields = '__all__'
    success_url = reverse_lazy('raid-list')


class RaidAttendanceListView(ListView):
    model = RaidAttendance
    template_name = 'raid_attendance/raid_attendance_list.html'
    context_object_name = 'raid_attendances'


class RaidAttendanceDetailView(DetailView):
    model = RaidAttendance
    template_name = 'raid_attendance/raid_attendance_detail.html'


class RaidAttendanceCreateView(CreateView):
    model = RaidAttendance
    template_name = 'raid_attendance/raid_attendance_create.html'
    fields = '__all__'
    success_url = reverse_lazy('raid-attendance-list')


class RaidAttendanceUpdateView(UpdateView):
    model = RaidAttendance
    template_name = 'raid_attendance/raid_attendance_update.html'
    fields = '__all__'
    success_url = reverse_lazy('raid-attendance-list')

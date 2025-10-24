# TODO: AI suggested class to handle DRF bug that was trying to interact with all db's associated to project
# TODO: Possibly remove later if we decide to remove quarm_db from docker-compose
# TODO: UPDATE: Didnt work anyways, work-around is to just comment out db in settings for now

class QuarmDbRouter:
    def db_for_read(self, model, **hints):
        # Only allow quarm_db for specific models or explicit hints
        if hints.get('database') == 'quarm_db':
            return 'quarm_db'
        return 'default'

    def db_for_write(self, model, **hints):
        # Never write to quarm_db unless explicitly specified
        if hints.get('database') == 'quarm_db':
            return 'quarm_db'
        return 'default'

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Allow migrations only on quarm_db for specific apps/models
        if db == 'quarm_db':
            return True
        return db == 'default'

    def allow_relation(self, obj1, pbj2, **hints):
        return True
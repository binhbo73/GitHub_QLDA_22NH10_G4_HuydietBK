from django.core.management.commands.runserver import Command as RunserverCommand
import subprocess
import os
import signal
import threading

class Command(RunserverCommand):
    help = 'Runs development server with Daphne'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting custom runserver'))
        
        # Extract IP and port
        self.addr = options.get('addrport', '').split(':')
        ip = self.addr[0] if len(self.addr) > 0 else '127.0.0.1'
        port = self.addr[1] if len(self.addr) > 1 else '8000'

        self.stdout.write(self.style.SUCCESS(f'Starting Daphne on {ip}:{port}'))

        def run_daphne():
            cmd = f'daphne -b {ip} -p {port} chatbot_ai_server.asgi:application'
            process = subprocess.Popen(cmd, shell=True)
            try:
                process.wait()
            except KeyboardInterrupt:
                process.send_signal(signal.SIGTERM)

        daphne_thread = threading.Thread(target=run_daphne)
        daphne_thread.daemon = True
        daphne_thread.start()

        super().handle(*args, **options)
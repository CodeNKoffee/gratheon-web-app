# docker_compose('docker-compose.dev.yml',project_name="gratheon")
# docker_build('local/web-app', '.',
# 	live_update = [
#     # Sync local files into the container.
#     sync('.', '/app/'),

#     # Re-run npm install whenever package.json changes.
#     run('npm i', trigger='package.json'),

#     # Restart the process to pick up the changed files.
#     restart_container()
#   ])

# cmd='npm install',
local_resource('web-app',  serve_cmd='npm run dev', deps=['package.json'], labels=["app"], allow_parallel=True)
from app import create_app

application = create_app()
application.run(debug=True, threaded = True)
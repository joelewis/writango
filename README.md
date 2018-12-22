# What is Writango?

Writango is a tool to write something and publish it as a playable article. [There's a demo here.](http://writango.com/writes/@joelewis/play/whats-writango-1596183143) It could be considered as an article that could be presented like a presentation.

# Installation Guide
Writango is a [Python / Django](https://www.djangoproject.com/) project.
The front-end is written with [React](https://www.djangoproject.com/). Being a Django project you can use your database of choice. Just configure settings.py to suit your needs. It runs using SQLite by default. [Look here](https://github.com/joelewis/writango/blob/master/server/writango_project/sample_settings.py) for sample settings.py.


```
git clone https://github.com/joelewis/writango
cd writango
virtualenv venv
pip install -r requirements.txt

# Edit sample_settings.py to suit your needs and rename it to settings.py.

cd server/
python manage.py makemigrations
python manage.py migrate
python manage.py runserver


cd ../client/
npm install # make sure you've got the right version of node & NPM
webpack --config webpack.config.js --watch # use webpack.config.production.js for production compiling
```

If you visit http://localhost:8000, you should be able to reach your Writango instance.

# Roadmap
Refer [TODO.txt](https://github.com/joelewis/writango/blob/master/TODO.txt) to refer things in pipeline. If you are familiar with Python or React and/or simply interested in the project, do help complete the TODO.


# LICENSE
MIT License. 

Pull requests are welcome. Use github issues to file bugs and other queries.



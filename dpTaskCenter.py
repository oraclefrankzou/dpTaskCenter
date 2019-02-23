from app import app
from settings import Settings
from flask import render_template


@app.route("/main")
def main():
    return render_template("main.html")

if __name__ == '__main__':

    app.run(host=Settings.HOST,port=Settings.PORT)
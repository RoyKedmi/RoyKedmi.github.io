#!/usr/bin/python
import os

def main():
    template_file = open("./template.html", "rb")
    template = template_file.read()
    template_file.close();

    directory = "../"
    for subdir, dirs, files in os.walk(directory):
        for filename in files:
            filepath = subdir + os.sep + filename
            if filepath.endswith(".rskhtml"):
                print filepath
                rskhtml_file = open(filepath, "rb")
                rskhtml_data = rskhtml_file.read()
                rskhtml_file.close()

                html_data = template.replace("CONTENT_DIV_MAGIC", rskhtml_data)
                html_filepath = filepath.replace(".rskhtml", ".html")
                html_file = open(html_filepath, "wb")
                html_file.write(html_data)
                html_file.close()

if __name__ == "__main__":
    main()

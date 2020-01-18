#!/usr/bin/python
import os
from lxml import html

def generate_static_html(template):
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

def generate_devblog(template):
    directory = "../devblog/posts/"
    devblog_title = '<h1 class="title is-size-1 center">Devblog</h1>'
    link = "<p>{} <a href='/devblog/posts/{}'>{}</a></p>"
    links = []
    for subdir, dirs, files in os.walk(directory):
        for filename in files:
            filepath = subdir + os.sep + filename
            if filepath.endswith(".html"):
                print filepath
                html_file = open(filepath, "rb")
                html_data = html_file.read()
                html_file.close()
                tree = html.fromstring(html_data)
                publish_time = tree.xpath('//time')[0].get('datetime')
                title = tree.xpath('//h1')[0].text
                links.append(link.format(publish_time, filename, title))
    
    devblog_data = devblog_title
    devblog_data += "<div>"
    for l in links:
        devblog_data += l;
        print devblog_data
    devblog_data += "</div>"

    html_data = template.replace("CONTENT_DIV_MAGIC", devblog_data)
    devblog_file = open("../devblog/devblog.html", "wb")
    devblog_file.write(html_data);
    devblog_file.close()
    print html_data

def main():
    template_file = open("./template.html", "rb")
    template = template_file.read()
    template_file.close();

    generate_static_html(template)
    generate_devblog(template);

if __name__ == "__main__":
    main()

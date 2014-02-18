#!/usr/bin/env python

import re
import cgi
import os
import sys
import urlparse
import Cookie
import datetime
from boto.s3.connection import S3Connection
from collections import defaultdict

VALID_FALLBACK_NEW_VALUES = [ None, "U", "0", "1" ]
VALID_FALLBACK_COOKIE_VALUES = [ "U", "0", "1" ]

fileName, fileExt = os.path.splitext(os.environ["SCRIPT_URL"])

if fileExt == ".html":
	contentTypeFlag = "H"
	contentType = "text/html"
elif fileExt == ".json":
	contentTypeFlag = "J"
	contentType = "application/json"
else:
	print "Status: 415 Unsupported Media Type"
	print
	sys.exit(0)

if "REQUEST_METHOD" not in os.environ:
	print "Status: 400 Bad Request (NO METHOD)"
	print
	sys.exit(0)

requestMethod = os.environ["REQUEST_METHOD"]
fallbackNewValue = None

if requestMethod == "GET":
	if "QUERY_STRING" in os.environ:
		query_params = urlparse.parse_qs(os.environ["QUERY_STRING"])
		if "value" in query_params:
			fallbackNewValue = query_params["value"][0]
elif requestMethod == "POST":
	form = cgi.FieldStorage()
	if "value" in form:
		fallbackNewValue = form.getfirst("value").strip()
	else:
		print "Status: 400 Bad Request"
		print
		sys.exit(0)	
else:
	print "Status: 400 Bad Request (BAD METHOD)"
	print
	sys.exit(0)

fallbackCookieValue = None

if "USE_FALLBACK_COOKIE" in os.environ:
	fallbackCookieValue = os.environ["USE_FALLBACK_COOKIE"]
else:
	print "Status: 500 Internal Server Error"
	print
	sys.exit(0)

if fallbackNewValue not in VALID_FALLBACK_NEW_VALUES:
	print "Status: 400 Bad Request (INVALID NEW VALUE: " + fallbackNewValue + ")"
	print
	sys.exit(0)

if fallbackCookieValue not in VALID_FALLBACK_COOKIE_VALUES:
	print "Status: 400 Bad Request (INVALID COOKIE VALUE: " + fallbackCookieValue + ")"
	print
	sys.exit(0)

print "Content-Type: " + contentType

if fallbackNewValue is not None:
	expiration = datetime.datetime.now() + datetime.timedelta(days=3650)
	cookie = Cookie.SimpleCookie()
	cookie["ai2_sc_js_use_fallback"] = fallbackNewValue
	cookie["ai2_sc_js_use_fallback"]["path"] = "/"
	cookie["ai2_sc_js_use_fallback"]["expires"] = expiration.strftime("%a, %d-%b-%Y %H:%M:%S PST")	
	print cookie.output()

print

if contentTypeFlag == "J":
	if fallbackNewValue is not None:
		print '{ "useFallback" : "' + fallbackNewValue + '" }'
	else:
		print '{ "useFallback" : "' + fallbackCookieValue + '" }'
else:
	fallbackValue = fallbackNewValue if fallbackNewValue is not None else fallbackCookieValue
	print """
<html>
        <head>
                <title>sitecues Fallback Override</title>
				<style type="text/css">
					body {
						font-family: Arial
					}
				</style>
        </head>
        <body>
			<h1>sitecues&trade; Fallback Override</h1>
			<p>
"""

	if fallbackValue == "U":
		print """
The sitecues&trade; fallback override is disabled. The fallback will be invoked for unsupported browsers, but not for supported browsers.
"""
	elif fallbackValue == "0":
		print """
The sitecues&trade; fallback override is set to never invoke the fallback, even for unsupported browsers.
"""
	elif fallbackValue == "1":
		print """
The sitecues&trade; fallback override is set to always invoke the fallback, even for supported browsers.
"""

	print """
			</p>
			<p>
			<form method="post">
				Set the sitecues&trade; fallback override to:
				<select name="value">
"""
	print '					<option value="U"' + (' selected="selected"' if fallbackValue is "U" else '') + '>Rely upon the supported browser list</option>'
	print '					<option value="0"' + (' selected="selected"' if fallbackValue is "0" else '') + '>Never invoke the fallback</option>'
	print '					<option value="1"' + (' selected="selected"' if fallbackValue is "1" else '') + '>Always invoke the fallback</option>'

	print """
				</select>
				<input type="submit" value="Update" />
			</form>
			</p>
        </body>
</html>
"""

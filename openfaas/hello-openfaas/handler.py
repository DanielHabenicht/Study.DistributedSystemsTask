import sys


def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """
    sys.stderr.write("This should be an error message.\n")
    return "Hello OpenFaas!"



#存放项目公用函数工具

#根据request请求，返回所有请求参数，返回类型:dict
def getRequestParams(request):
    params={}
    for key in (request.args.keys()):
        #如果值不为None,null或是长度大于0的,分页参数也不需要进来，则加到参数dict中
        if ( request.args.get(key)!=None
             and request.args.get(key)!="null"
             and request.args.get(key) != "page"
             and request.args.get(key) != "limit"
             and len(request.args.get(key))!=0):
            params[key]=request.args.get(key)

    return params
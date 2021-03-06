/*exported setupBackendMock*/
function setupBackendMock($httpBackend)
{
    'use strict';

    var sequence = 0;
    var tasks = [
        {id: sequence++, title: 'Configure AngularJS routing', description: 'Some Details', repository_url: 'https://github.com/aniaw/angular-exercises.git', branch_name:'exercise1', assign_to:['test1','test2'], tags: ['tag1','tag2']},
        {id: sequence++, title: 'Bind Posts', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Bind Posts From DAO', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Implement DAO', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Creating own DAO resource', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Create CRUD', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Using angular-xeditable', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Typeahead component', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Multilanguage using angular-gettext', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Drag and Drop', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Pagination Support', description: 'Some Details', tags: ['tag1','tag2']},
        {id: sequence++, title: 'Configure backend mocking', description: 'Some Details', tags: ['tag1','tag2']}
    ];

    var tests = [];

    function parseQueryString(url)
    {
        var args = url.split('?');
        args = args[1] || args[0];
        args = args.split('&');
        var result = {};
        var arg;
        for (var i = 0; i < args.length; i++) {
            arg = decodeURI(args[i]);

            if (arg.indexOf('=') == -1) {
                result[arg.trim()] = true;
            } else {
                var kvp = arg.split('=');
                result[kvp[0].trim()] = kvp[1].trim();
            }
        }
        return result;
    }

    $httpBackend.whenGET(/\/api\/task(\?.*)$/).respond(function (method, url)
    {
        var params = parseQueryString(url);
        var first = parseInt(params.firstResult);
        var max = parseInt(params.maxResults);

        var count = 0;
        var result = [];
        for (var i in tasks) {
            if (tasks[i] && (-1<tasks[i].title.indexOf(params.searchQuery) || !params.searchQuery))
            {
                if ((count>=first) && (count<first+max))
                {
                    result.push(tasks[i]);
                }
                count++;
            }
        }
        return [200, {resultList: result, resultCount: count}];
    });

    $httpBackend.whenGET(/\/api\/task\/(\d+)/).respond(function (method, url)
    {
        var match;
        match = /\/api\/task\/(\d+)/.exec(url);
        if (match) {
            var id = parseInt(match[1], 10);
            return [200, tasks[id-1]];
        }
        return [404];
    });

    $httpBackend.whenPOST(/\/api\/task$/).respond(function (method, url, json_params)
    {
        var task = JSON.parse(json_params);

        if(task.hasOwnProperty('id')){ // update
            var id = task['id'];
            tasks[id]=task;
            return [200, tasks[id]];
        }else{ // create
            tasks.push(task);
            return [200, task];
        }
        return [404];
    });

    $httpBackend.whenGET(/.*\.html/).passThrough();
}

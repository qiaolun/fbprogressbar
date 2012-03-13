
FBProgress = (function(){

    // debug, info, warn ...
    var d = console || function(){
        return {
            debug : function(){},    
            info : function(){}
        };        
    };

    var params = {};

    var steps = {};

    steps.start = {
        open : function(){
            // pass    
        },
        check : function() {
            allStepsStatus['start'] = true;
        },
    };

    var likeCheckInterval = null;
    steps.like = {
        open : function() {
            // TODO open like dialog
            var dlg = $('<div style="padding: 40px 60px; border: 3px solid #ccc; position: absolute; top: 100px; background-color: #eee;"><iframe src="//www.facebook.com/plugins/like.php?href=http://www.facebook.com/funplusgame&amp;layout=standard&amp;show_faces=false&amp;width=550&amp;action=like&amp;colorscheme=light&amp;height=25" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:550px; height:25px;" allowTransparency="true"><\/iframe><button id="like_dlg_close">Close<\/button><\/div>') .appendTo('body');

            $('#like_dlg_close').click(function(){
                dlg.remove();    
                steps.like.check();
            });

        },
        check : function() {
            d.info('steps.like.check');

            var fanPageId = params['fanPageId'];
            var uid = params['uid'];
            var sql = 'SELECT uid FROM page_fan WHERE uid = ' + uid + ' AND page_id =  ' + fanPageId;
            FB.api({
                    method: 'fql.query',
                    query: sql
                },
                function(result) {
                    if(result[0]) {
                        // like
                        allStepsStatus['like'] = true;
                    } else {
                        allStepsStatus['like'] = false;
                    }
                    updateUI();
                }
            );

            return false; 
        },    
    };
    steps.continous = {
        open : function() {
            if(allStepsStatus['continous']) {
                // pass
            } else {
                // TODO open alert
                alert('need more continous login days.');
            }
        },
        check : function() {
            var days = params['continousDays'] || 0;
            d.info(params['continousDays']);
            if(days >= 3) {
                allStepsStatus['continous'] = true;
            } else {
                allStepsStatus['continous'] = false;
            }
        },    
    };
    steps.invite = {
        open : function() {
            if(allStepsStatus['invite']) {
                // pass
            } else {
                // TODO open invite dialog
            }
        },
        check : function() {
            var count = params['inviteCount'] || 0;
            if(count >= 8) {
                allStepsStatus['invite'] = true;
            } else {
                allStepsStatus['invite'] = false;
            }
        },    
    };


    var allStepsStatus = {};
    var initSteps = function(){
        for(var step in steps) {
            steps[step].check();
        }
    };
 
    var drawUI = function() {

    };

    var updateUI = function() {
        d.info(allStepsStatus);
        for(var step in allStepsStatus) {
            $('#check_'+step).removeClass('on');
            if(allStepsStatus[step]) {
                $('#check_'+step).addClass('on');
            } 
        }
    };


    var ret = {
        open : function(step) {
            steps[step].open();
        },
        init : function(wrapper, _params) {
            params = _params || {} ; 
            
            drawUI();
            initSteps();
            updateUI();
        }
    };

    return ret;

})();

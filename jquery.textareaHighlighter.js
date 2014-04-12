/**
 * jquery-textareaHighlighter
 * A jQuery plugin for highlight text in textareas with custom colors.
 * See the [wiki](??) for usage and examples.
 *
 * (c) 2014 Pahomov Dmitry <topt.iiiii@gmail.com> - danielimhoff.com
 */

/*var get_selection = function (id) {
    var scroll = $(window).scrollTop(),
        selection = $(id).textrange('get'),
        indfirst = selection.start,
        indlast = selection.end - 1;
    if (indfirst > indlast) {
        indfirst = indlast = -2;
    }
    //$(window).scrollTop(scroll);
    return {
        indfirst: indfirst,
        indlast: indlast
    };
};*/

(function( $ ) {
    var PLUGINNAME = 'textareaHighlighter';
    var PLUGINDATAKEY = PLUGINNAME+'data';
    var EVENTNAMESPACE = '.'+PLUGINNAME+'_evt';
    var methods = {
        init: function (options) {
            var settings = $.extend( {
                fontsize: 14,
                cols: 65,
                rows: 3
            }, options);
            var data = {
                _helperel: null,
                _textareael: null,
                _fontsize: settings.fontsize,
                _linesize: settings.fontsize+2,
                _ishelperhidden: false
            }
            var content = this.val() || '';
            var id = this.attr('id') || PLUGINNAME+Math.random().toString(36).substr(2, 5);
            var bgcolor = this.css('backgroundColor') || 'yellow';
            var fontstyle = 'normal '+data._fontsize+'px/'+data._linesize +'px "Courier New",Courier,monospace';
            var cssfortextareael = {
                'margin': '0',
                'padding': '0',
                'position': 'relative',
                'border': '1px solid #999999',
                'outline': 'none',
                'overflow': 'scroll',
                'width': '100%',
                'background': 'transparent',
                'resize': 'none',
                'font': fontstyle
            };
            var cssforhelperel = {
                'position': 'absolute',
                'background': bgcolor,
                'white-space': 'pre',
                'border': '1px solid transparent',
                'color': 'transparent',
                'font': fontstyle,
                'overflow': 'scroll'
            };
            data._textareael = $('<textarea cols="'+settings.cols+'" rows="'+settings.rows+'" wrap="off">' + content + '</textarea>')
                .attr('id', id)
                .bind('keyup'+EVENTNAMESPACE, methods._textareaonchange)
                .bind('paste'+EVENTNAMESPACE, function(e) {setTimeout(function () {methods._textareaonchange(e);}, 1);});

            this.replaceWith(data._textareael);
            // this is not valid!
            data._textareael.resizable({resize: methods._textarearesize})
                .bind('scroll'+EVENTNAMESPACE, methods._textareascroll)
                .css(cssfortextareael); // TODO - remove chain?
            data._helperel = $('<span></span>')
                .css(cssforhelperel)
                .insertBefore(data._textareael);
            data._textareael.data(PLUGINDATAKEY, data);
            data._textareael.keyup();
        },
        destroy: function() {
            $(window).undind(EVENTNAMESPACE);
            $this = $(this);
            var data = $this.data(PLUGINDATAKEY);
            data._helperel.remove();
            data._textareael.resizable('destroy');
            data._textareael.remove();
            $this.removeData(PLUGINDATAKEY);
        },
        _textareascroll: function(e) {
            $this = $(this);
            var data = $this.data(PLUGINDATAKEY);
            if (!data._ishelperhidden) {
                data._helperel.scrollTop($this.scrollTop());
                data._helperel.scrollLeft($this.scrollLeft());
            }
        },
        _textarearesize: function(e) {
            //console.log(this);
            $this = $('textarea', this);
            var data = $this.data(PLUGINDATAKEY);
            if (!data._ishelperhidden) {
                data._helperel.height($this.height());
                data._helperel.width($this.width());
            }
        },
        _textareaonchange: function (e) {
            methods._hidehelper.apply(this);
        },
        _hidehelper: function () {
            $this = $(this);
            var data = $this.data(PLUGINDATAKEY);
            if (!data._ishelperhidden) {
                data._helperel.hide();
                data._ishelperhidden = true;
            }
        },
        _showhelper: function (target) {
            $this = $(this);
            var data = $this.data(PLUGINDATAKEY);
            if (data._ishelperhidden) {
                data._helperel.show();
                data._ishelperhidden = false;
                $this.resizable('option', 'resize').apply($this.parent()); // magic....
            }
        },
        highlight: function (start, end, color) {
            $this = $(this);
            var data = $this.data(PLUGINDATAKEY);
            var srctext = $this.val();
            var p = [];
            p[0] = srctext.substring(0, start);
            p[1] = srctext.substring(start, end+1);
            p[2] = srctext.substring(end+1, srctext.length);
            data._helperel.html(p[0]+'<span style="background: '+color+'">'+p[1]+'</span>'+p[2]);
            methods._showhelper.apply(this);
            data._textareael.scroll();
        }
    };

    $.fn[PLUGINNAME] = function( method ) {
        var argsclosure = arguments;
        if ( methods[method] ) {
            return this.each(function() {
                methods[ method ].apply( $(this), Array.prototype.slice.call( argsclosure, 1 ));
            });
        } else if ( typeof method === 'object' || ! method ) {
            return this.each(function() {
                methods.init.apply( $(this), arguments );
            });
        } else {
            $.error( 'No method with name ' +  method + ' for jQuery.textareaHighlighter' );
        }
    };

})( jQuery );


/*$('#test1').textareaHighlighter( {fontsize: 14} );
$('#test3').click(function(e) {
    var sel = get_selection('#test1');
    var color = 'orange';
    if (sel.indlast !== -2) {
        $('#test1').textareaHighlighter('highlight', sel.indfirst, sel.indlast, color);
        console.log(sel.indfirst +' '+sel.indlast+' @ $("#test3").click');
    } else {
        console.log('-2 @ get_selection');
    }
});

$('#test11').textareaHighlighter( {fontsize: 14} );
$('#test33').click(function(e) {
    var sel = get_selection('#test11');
    var color = 'orange';
    if (sel.indlast !== -2) {
        $('#test11').textareaHighlighter('highlight', sel.indfirst, sel.indlast, color);
        console.log(sel.indfirst +' '+sel.indlast+' @ $("#test3").click');
    } else {
        console.log('-2 @ get_selection');
    }
});*/
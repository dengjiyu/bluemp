<script>


/** 
 *ͶƱ�ύtool
 * @config.container {seletor} ��ʼ��domѡ����
 * @config.fnSuccess {function} ͶƱ�ύ�ɹ�callback,�����ύ�ɹ�֮�������������������ͶƱ�����ʾ
 */

bluemp.tool.Vote = function() {
    var vote = function(config) {
        this.targetContainer = config.container;
        if (config.fnSuccess) {
        	this.fnSuccess = config.fnSuccess;
        }
        this._init();
    };

    vote.prototype = {
    	_init: function () {
    		var _this = this;
            jsonAjax("/Portal/getVoteInfo",{
            	articleid: bluemp_aid,
            	voteresult: 0
            },function(data){
				if(data.status=='1'){
					if (!data.info.sid) {
                        return;
					}
					_this.voteInfo = data.info;
					_this._renderVote();
				} else {

				} 
			},'post');
    	},

    	_renderVote: function () {
            var voteTpl = this._getVoteTpl();
            var questionItemTpl; // = this._getQuestionItemTpl();
            var answerItemTpl; // = this._getVoteAnswerItemTpl();
            this.targetContainer.append(voteTpl);
            $(".vote_subject_content").text(this.voteInfo.subject);
            $(".subjectid").val(this.voteInfo.sid);
            if (this.voteInfo.voteresult == 1) {
                $(".vote_submit_area").hide();
            }

            for (var i = 0; i < this.voteInfo.option.length; i++) {
            	// this.voteInfo.option[i]
            	questionItemTpl = this._getQuestionItemTpl();
                var $questionItemTpl = $(questionItemTpl);
                $questionItemTpl.find(".questionid").attr("value", this.voteInfo.option[i].questionid);
                $questionItemTpl.find(".question_content_text").text((i+1) + ". " + this.voteInfo.option[i].question);
                $(".vote_qa_area").append($questionItemTpl);
                for (var j = 0; j < this.voteInfo.option[i].answer.length; j++) {
                	answerItemTpl = this._getVoteAnswerItemTpl(this.voteInfo.optiontype);
                	var $answerItemTpl = $(answerItemTpl);

                    $answerItemTpl.find(".answer_check").attr({
                    	value: this.voteInfo.option[i].answer[j].id,
                    	name: "answer" + this.voteInfo.option[i].questionid,
                    	id: "answer" + this.voteInfo.option[i].questionid + "a" + this.voteInfo.option[i].answer[j].id
                    });
                    
                    $answerItemTpl.find(".answer_result").addClass('answer_result_q' + this.voteInfo.option[i].questionid + "a" + this.voteInfo.option[i].answer[j].id);
                    
                	$answerItemTpl.find(".answer_content").text(this.voteInfo.option[i].answer[j].option);
                	$answerItemTpl.find(".answer_content").attr("for", "answer" + this.voteInfo.option[i].questionid + "a" + this.voteInfo.option[i].answer[j].id);
                	$($(".answer_contents_list")[i]).append($answerItemTpl);
                }
            }
            if (this.voteInfo.voteresult == 1) {
            	this._displayResult(this.voteInfo);
            } else {
                this._addVoteSubmitEvent();
                this._initEvents();
            }
    	},

    	_initEvents: function () {
    		$(".answer_content").on('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.previousElementSibling.type == "radio") {
					event.target.previousElementSibling.checked = true;
				} else {
					event.target.previousElementSibling.checked = !event.target.previousElementSibling.checked;
				}
				
			});
    	},

    	_getVoteTpl: function () {
    		var tpl = "";
            tpl += '<div class="img_text_n vote_container">';
		    tpl += '    <div class="Hot2_n">';
		    tpl += '        <input type="hidden" value="" class="subjectid">';
		    tpl += '        <p class="Hot2_n_p"><img src="/Public/Home/Images/dcjg_xz_icon.png">&nbsp;<span class="vote_subject_content"></span></p>';
		    tpl += '    </div>';
		    tpl += '    <div class="vote_qa_area"></div>';
		    tpl += '    <p class="vote_submit_area" style="text-align: center;">';
		    tpl += '        <input type="button" class="dytp_tj_btn vote_submit_btn">';
		    tpl += '    </p>';
		    tpl += '</div>';
		    return tpl;
    	},

    	_getQuestionItemTpl: function () {
            var tpl = "";
            tpl += '<div class="Hot2_n">';
			tpl += '    <input type="hidden" class="questionid" value="">';
			tpl += '    <div class="Hot2_n2 question_content">';
			tpl += '        <p class="Hot2_n_p2 question_content_text"></p>';
			tpl += '    </div>';
			tpl += '    <div class="Hot2_n answer_contents">';
			tpl += '        <div class="Hot2_n2 answer_contents_list">';
			tpl += '        </div>';
			tpl += '    </div>';
			tpl += '</div>';
		    return tpl;
    	},

    	_getVoteAnswerItemTpl: function (type) {
    		var tpl = "";
    		tpl += '<p class="Hot2_n_p3">';
    		if (type == 1) {
                tpl += '    <input class="answer_check" value="" id="" type="radio">';
    		} else {
                tpl += '    <input class="answer_check" value="" id="" type="checkbox">';
    		}
			tpl += '    <label class="answer_content"></label>';
			tpl += '	<p class="Hot2_n_p3 answer_result" style="display:none;">';
            tpl += '        <span class="dyjd_span answer_result_color" style=""></span>';
            tpl += '        <span class="dyjd_span answer_result_base_color"></span>';
            tpl += '        <span class="dyjd_num_span answer_result_percent"></span>';
            tpl += '    </p>';
			tpl += '</p>';
			return tpl;
    	},

    	_addVoteSubmitEvent: function () {
    		var _this = this;
			$('.vote_submit_btn').unbind('click').click(function(){
				if(loginCheck()){
					var $container = $(this.parentNode.parentNode);
					var result = {};
					result.subjectid = $container.find(".subjectid").val();
					result.articleid = bluemp_aid;
					result.qainfo = {};
					var questions = $container.find(".questionid");
					for (var i = 0; i < questions.length; i++) {
						var questionid = $(questions[i]).val();
						var answers;
						if ($(questions[0]).parent().find('.answer_contents').find('input[type="radio"]').length > 0) {
				            answers = $(questions[i]).parent().find('.answer_contents').find('input[type="radio"]');
						} else {
							answers = $(questions[i]).parent().find('.answer_contents').find('input[type="checkbox"]');
						}
						var checkedVal = [];
						for (var j = 0; j < answers.length; j++) {
							if(answers[j].checked == true){
								if (answers[j].value > 0 && answers[j].value < 7) {
                                    checkedVal.push(answers[j].value);
								} else {
								    popup.remind("���ύ�����ݴ����쳣")
								    return false;	
								}
							}
						}
						if (checkedVal.length == 0) {
						    popup.remind("���Ĵ𰸻�δ��д��ȫ")
						    return false;
						}
						result.qainfo[i] = checkedVal;
					}
					jsonAjax("/Portal/submitVote",result,function(data){
						if(data.status=='1'){
							_this._displayResult(data.info);
							if (_this.fnSuccess) {
                                _this.fnSuccess();
							}
						} else {
	                        console.error("submit res = " + JSON.stringify(data));
						} 
					},'post');	
				}
			})
    	},

    	_displayResult: function (voteInfo) {
    		$(".answer_check").remove();
    		$(".vote_submit_area").remove();
    		$(".answer_result").show();
    		var answerRsts = $(".answer_result");
    		var answerData = [];
    		for (var i = 0; i < voteInfo.option.length; i++) {
    			for (var j = 0; j < voteInfo.option[i].answer.length; j++) {
    				var answerItem = {};
    				answerItem.id = voteInfo.option[i].answer[j].id;
    				answerItem.color = "#0066C" + j;
                    if(voteInfo.option[i].optionsum == 0){
                        percent = 0;
                        answerItem.width = "0%";
                    }else{
                        var percent = parseInt(voteInfo.option[i].answer[j].selectednum) / parseInt(voteInfo.option[i].optionsum);
                        percent = percent.toFixed(5);
                        percent = percent.slice(0, 5);
                        percent = percent * 100;
                        percent = percent.toFixed(1);
                        answerItem.width = parseInt(voteInfo.option[i].answer[j].selectednum) / parseInt(voteInfo.option[i].optionsum) * 70 + "%";
                    }
    				answerItem.percent = voteInfo.option[i].answer[j].selectednum + "(" + percent + "%)";
    				answerData.push(answerItem);
    			}
    		}
    		for (var i = 0; i < answerRsts.length; i++) {
    			$(answerRsts[i]).find('.answer_result_color').css({
    				color: answerData[i].color,
    				width: answerData[i].width
    			});
    			$(answerRsts[i]).find('.answer_result_percent').text(answerData[i].percent);
    		}
    	}
    };

    return vote;
}()

/* 
 *����tool
 * 
 * @config.html {string} ����html
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} �ر�callback
 */

bluemp.tool.Dialog = function() {
    var dialog = function(config) {
        var DEFAULT_CONFIG = {
            closeBtn: false,
        };

        var _this = this;
        this._config = $.extend({}, DEFAULT_CONFIG, config);
        this.fnSuccess = config.fnSuccess;
        this.fnFailed = config.fnFailed;
        var index = $.layer({
            type: 1,
            title: false,
            area: ['100%', '210px'],
            shade: [0.5, '#000'],
            border: [0],
            offset: ["0px", "0%"],
            closeBtn: false,
            page: {
                html: _this._config.html
            },
            success: function() {
                $(document).bind('touchmove', function(event) {
                    event.preventDefault();
                })
                $('#closelay').unbind('click').click(function() {
                    layer.close(index);
                    if(typeof _this._config.fnFailed()=='function'){
                    	_this._config.fnFailed();
                    }
                	
                    $(document).unbind('touchmove');
                })
                _this._config.fnSuccess();
                //$(document).unbind('touchmove');�ͷŹ����¼�
            }
        })
    };

    return dialog;
}()

/** 
 *���»ظ�tool
 *
 * @config.container {seletor} ��ʼ��domѡ����
 * @config.params {object}
 * @config.params.aid {string} ����id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.tool.Reply = function(){
	var re = function(config){
		var DEFAULT_CONFIG = {
		
		};
		
		var _this = this;
		var $container = $(config.container);
		this.container = $container;
		this._config = $.extend({}, DEFAULT_CONFIG, config);
		this.fnSuccess = config.fnSuccess;
		this.fnFailed = config.fnFailed;
		this.flag = true;
		this.container.click(function(){
			if(loginCheck()&&_this.flag){
				_this.flag = false;
				_this._init(config.fnSuccess,config.fnFailed);
			}else{
			
			};
			
		});
	};
	
	re.prototype = {
		_init : function(fnS,fnF){
			var p = {};
			p.params = {};
			p.params.aid = this._config.params.aid;
			var _this = this;//�����жϣ������Ƿ��ֹ���ۣ��û��Ƿ���ԣ��Ƿ���������
			p.fnSuccess = function(dataC){
				var q = {};
				q.fnSuccess = function(dataR){
					var o = {};
					o.params = {};
					o.params.aid = _this._config.params.aid;
					o.fnSuccess = function(data){
						if(data.status=='1'){
							var is_anonymity = data.is_anonymity;
							var html = _this._getHtml(is_anonymity);
							var config = {};
							config.html = html;
							config.fnSuccess = function(){
								_this._numLimit();
								_this._initFace();
	                            $('#postreply').unbind('click').click(function(){   //��Ҫ�Ķ�
								//$(document).unbind('click').on('click','#postreply',function(){
									var params = {};
									params.aid = p.params.aid;
									$('#anonymous').is(':checked')?params.anonymity = 0:params.anonymity = 1;
									params.content = $('#reply-content').val();
									var m = {};
									m.params = params;
									m.fnSuccess = function(data){
										_this.flag = true;
										fnS(data);
									};
									m.fnFailed = function(data){
										_this.flag = true;
										fnF(data);
									};
									bluemp.api.Reply(m);
									$(document).unbind('touchmove');
									
								})
							}
							
							config.fnFailed = function(){
								_this.flag = true;
							}
							new bluemp.tool.Dialog(config)
						}else{
							popup.remind(data.info);
						}
					}
					bluemp.api.IsAnonymity(o)
				}
				q.fnFailed = function(dataR){
					popup.remind(dataR.info);
					return false;
				}
				bluemp.api.Silenced(q);
			}
			p.fnFailed = function(dataC){
				popup.remind(dataC.info);
				return false;
			}
			bluemp.api.noComment(p)
			
		},
		
		_getHtml : function(data){
			var 	html= '';
	        html+='<div class="huifutanchu">';
			html+='<div class="huifu-textarea">';
		    html+='<textarea style="width:100%;maxlength:140;" id="reply-content"  class="emotion chackTextarea"></textarea>';
			html+='</div><div class="huifu_sz"><span style="float:right" id="textcount" class="num">140</span></div>';
			html+='<ul class = "reply-ul"><li class="reply-ul_left"><span class="span2"><a href="javascript:void(0);" id="face"><img src="/Public/Home/Images/biaoqing-icon.jpg"></a></span></li>';
			if(data=='1'){
				html+='<li class="reply-ul_left"><h2><span><input type="checkbox" id="anonymous">�����ظ�</span></h2></li>';
			}
			html+='';
			html+='<li class="reply-ul_right"><div class="send-2btn" style="width:100%;"><div class="huifu_sz">';
			html+='<input type="button" class="input1" value="ȡ��" id="closelay">';
			html+='<input type="button" class="input2" value="����" id="postreply">';
			html+='</li>';
			html+='</div>';
			html+='</ul></div>';
			
			return html;
		},
		
		_numLimit : function(){
			var txtobj={
				   divName:"huifutanchu", //���������class
				   textareaName:"chackTextarea", //textarea��class
				   numName:"num", //���ֵ�class
				   num:140 //���ֵ������Ŀ
				} 
			$("."+txtobj.textareaName).on("focus",function(){
				$b=$(this).parents("."+txtobj.divName).find("."+txtobj.numName); //��ȡ��ǰ������
				$par=$b.parent(); 
				$onthis=$(this); //��ȡ��ǰ��textarea
				$num = txtobj.num;
				var setNum=setInterval(function(){
					var strlen=0; //��ʼ���峤��Ϊ0
					var txtval = $.trim($onthis.val());
					for(var i=0;i<txtval.length;i++){
						if(isChinese(txtval.charAt(i))==true){
							strlen=strlen+2;//����Ϊ2���ַ�
						}else{
							strlen=strlen+1;//Ӣ��һ���ַ�
						}
					}
					strlen=Math.ceil(strlen/2);//��Ӣ����ӳ�2ȡ����
					if($num-strlen<0){
						$par.html('<span style="float:right;" id="textcount" class="num">����<b  style="color:red;font-weight:lighter;" class='+txtobj.numName+'>'+Math.abs($num-strlen)+'</b> ��</span>'); //��������ʽ
						$('#postreply').attr("disabled",true).removeClass("input2").addClass("input1");
					}
					else{
						$par.html('<span style="float:right" id="textcount" class="num">'+($num-strlen)+'</span>'); //����ʱ��
						$('#postreply').attr("disabled",false).removeClass("input1").addClass("input2");
					}
					$b.html($num-strlen); 
				},500);    
				function isChinese(str){  //�ж��ǲ�������
					var reCh=/[u00-uff]/;
					return !reCh.test(str);
				}
			});
		},
		
		_initFace : function(){
			$('#face').SinaEmotion($('.emotion'));
		}
	};
	return re; 
}()


/** 
 *���»ظ�toolģ�黯��
 *
 * @config.container {seletor} ��ʼ��domѡ����
 * @config.params {object}
 * @config.params.aid {string} ����id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.tool.blockReply = function(){
	var re = function(config){
		var DEFAULT_CONFIG = {
		
		};
		
		var _this = this;
		var $container = $(config.container);
		this.container = $container;
		this._config = $.extend({}, DEFAULT_CONFIG, config);
		this.fnSuccess = config.fnSuccess;
		this.fnFailed = config.fnFailed;
		this.flag = true;
		this.container.click(function(){
			if(loginCheck()&&_this.flag){
				_this.flag = false;
				_this._init(config.fnSuccess,config.fnFailed);
			}else{
			
			};
			
		});
	};
	
	re.prototype = {
		_init : function(fnS,fnF){
			var p = {};
			p.params = {};
			p.params.aid = this._config.params.aid;
			var _this = this;//�����жϣ������Ƿ��ֹ���ۣ��û��Ƿ���ԣ��Ƿ���������
			p.fnSuccess = function(dataC){
				var q = {};
				q.fnSuccess = function(dataR){
					var o = {};
					o.params = {};
					o.params.aid = _this._config.params.aid;
					o.fnSuccess = function(data){
						if(data.status=='1'){
							var is_anonymity = data.is_anonymity;
							var html = _this._getHtml(is_anonymity);
							var config = {};
							config.html = html;
							config.fnSuccess = function(){
								_this._numLimit();
								_this._initFace();
	                            $('#postreply').unbind('click').click(function(){   //��Ҫ�Ķ�
								//$(document).unbind('click').on('click','#postreply',function(){
									var params = {};
									params.aid = p.params.aid;
									$('#anonymous').is(':checked')?params.anonymity = 0:params.anonymity = 1;
									params.content = $('#reply-content').val();
									var m = {};
									m.params = params;
									m.fnSuccess = function(data){
										_this.flag = true;
										fnS(data);
									};
									m.fnFailed = function(data){
										_this.flag = true;
										fnF(data);
									};
									bluemp.api.blockReply(m);
									$(document).unbind('touchmove');
									
								})
							}
							
							config.fnFailed = function(){
								_this.flag = true;
							}
							new bluemp.tool.Dialog(config)
						}else{
							popup.remind(data.info);
						}
					}
					bluemp.api.IsAnonymity(o)
				}
				q.fnFailed = function(dataR){
					popup.remind(dataR.info);
					return false;
				}
				bluemp.api.Silenced(q);
			}
			p.fnFailed = function(dataC){
				popup.remind(dataC.info);
				return false;
			}
			bluemp.api.noComment(p)
			
		},
		
		_getHtml : function(data){
			var 	html= '';
	        html+='<div class="huifutanchu">';
			html+='<div class="huifu-textarea">';
		    html+='<textarea style="width:100%;maxlength:140;" id="reply-content"  class="emotion chackTextarea"></textarea>';
			html+='</div><div class="huifu_sz"><span style="float:right" id="textcount" class="num">140</span></div>';
			html+='<ul class = "reply-ul"><li class="reply-ul_left"><span class="span2"><a href="javascript:void(0);" id="face"><img src="/Public/Home/Images/biaoqing-icon.jpg"></a></span></li>';
			if(data=='1'){
				html+='<li class="reply-ul_left"><h2><span><input type="checkbox" id="anonymous">�����ظ�</span></h2></li>';
			}
			html+='';
			html+='<li class="reply-ul_right"><div class="send-2btn" style="width:100%;"><div class="huifu_sz">';
			html+='<input type="button" class="input1" value="ȡ��" id="closelay">';
			html+='<input type="button" class="input2" value="����" id="postreply">';
			html+='</li>';
			html+='</div>';
			html+='</ul></div>';
			
			return html;
		},
		
		_numLimit : function(){
			var txtobj={
				   divName:"huifutanchu", //���������class
				   textareaName:"chackTextarea", //textarea��class
				   numName:"num", //���ֵ�class
				   num:140 //���ֵ������Ŀ
				} 
			$("."+txtobj.textareaName).on("focus",function(){
				$b=$(this).parents("."+txtobj.divName).find("."+txtobj.numName); //��ȡ��ǰ������
				$par=$b.parent(); 
				$onthis=$(this); //��ȡ��ǰ��textarea
				$num = txtobj.num;
				var setNum=setInterval(function(){
					var strlen=0; //��ʼ���峤��Ϊ0
					var txtval = $.trim($onthis.val());
					for(var i=0;i<txtval.length;i++){
						if(isChinese(txtval.charAt(i))==true){
							strlen=strlen+2;//����Ϊ2���ַ�
						}else{
							strlen=strlen+1;//Ӣ��һ���ַ�
						}
					}
					strlen=Math.ceil(strlen/2);//��Ӣ����ӳ�2ȡ����
					if($num-strlen<0){
						$par.html('<span style="float:right;" id="textcount" class="num">����<b  style="color:red;font-weight:lighter;" class='+txtobj.numName+'>'+Math.abs($num-strlen)+'</b> ��</span>'); //��������ʽ
						$('#postreply').attr("disabled",true).removeClass("input2").addClass("input1");
					}
					else{
						$par.html('<span style="float:right" id="textcount" class="num">'+($num-strlen)+'</span>'); //����ʱ��
						$('#postreply').attr("disabled",false).removeClass("input1").addClass("input2");
					}
					$b.html($num-strlen); 
				},500);    
				function isChinese(str){  //�ж��ǲ�������
					var reCh=/[u00-uff]/;
					return !reCh.test(str);
				}
			});
		},
		
		_initFace : function(){
			$('#face').SinaEmotion($('.emotion'));
		}
	};
	return re; 
}()
/** 
 *����ظ�tool
 *
 * @config.container {seletor} ��ʼ��domѡ����
 * @config.params {object}
 * @config.params.htid {string} ����id
 * @config.params.is_anonymity {string} �Ƿ�����
 * @config.params.rid {string} ����ظ�id�������ٻظ���
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.tool.topicReply = function(){
	var re = function(config){
		var DEFAULT_CONFIG = {
		
		};
		
		var _this = this;
		var $container = $(config.container);
		this.container = $container;
		this._config = $.extend({}, DEFAULT_CONFIG, config);
		this.fnSuccess = config.fnSuccess;
		this.fnFailed = config.fnFailed;
		this.flag = true;
		this.container.click(function(){
			if(loginCheck()){
				_this._init(config.fnSuccess,config.fnFailed);
			}else{
			
			};
			
		});
	};
	
	re.prototype = {
		_init : function(fnS,fnF){
			var p = {},q = {};
			p = this._config;
			var _this = this;
			q.fnSuccess = function(dataR){
				var is_anonymity = p.params.is_anonymity;
				var html = _this._getHtml(is_anonymity);
				var config = {};
				config.html = html;
				config.fnSuccess = function(){
					_this._numLimit();
					_this._initFace();
                    $('#postreply').unbind('click').click(function(){   //��Ҫ�Ķ�
					//$(document).unbind('click').on('click','#postreply',function(){
						var params = {};
						params.htid = p.params.htid;
						$('#anonymous').is(':checked')?params.anonymity = 0:params.anonymity = 1;
						params.content = $('#reply-content').val();
						if(p.params.rid){
							params.rid = p.params.rid;
						}
						var m = {};
						m.params = params;
						m.fnSuccess = function(data){
							_this.flag = true;
							fnS(data);
						};
						m.fnFailed = function(data){
							_this.flag = true;
							fnF(data);
						};
						
						if(_this.flag){
							_this.flag = false;
							bluemp.api.ReplyTopic(m);
						}
						$(document).unbind('touchmove');
						
					})
				}
				config.fnFailed = function(){
					_this.flag = true;
				}
				new bluemp.tool.Dialog(config)
			}
			q.fnFailed = function(dataR){
				popup.remind(dataR.info);
				return false;
			}
			bluemp.api.Silenced(q);
		},
		
		_getHtml : function(data){
			var 	html= '';
	        html+='<div class="huifutanchu">';
			html+='<div class="huifu-textarea">';
		    html+='<textarea style="width:100%;maxlength:140;" id="reply-content"  class="emotion chackTextarea"></textarea>';
			html+='</div><div class="huifu_sz"><span style="float:right" id="textcount" class="num">140</span></div>';
			html+='<ul class = "reply-ul"><li class="reply-ul_left"><span class="span2"><a href="javascript:void(0);" id="face"><img src="/Public/Home/Images/biaoqing-icon.jpg"></a></span></li>';
			if(data=='1'){
				html+='<li class="reply-ul_left"><h2><span><input type="checkbox" id="anonymous">�����ظ�</span></h2></li>';
			}
			html+='';
			html+='<li class="reply-ul_right"><div class="send-2btn" style="width:100%;"><div class="huifu_sz">';
			html+='<input type="button" class="input1" value="ȡ��" id="closelay">';
			html+='<input type="button" class="input2" value="����" id="postreply">';
			html+='</li>';
			html+='</div>';
			html+='</ul></div>';
			
			return html;
		},
		
		_numLimit : function(){
			var txtobj={
				   divName:"huifutanchu", //���������class
				   textareaName:"chackTextarea", //textarea��class
				   numName:"num", //���ֵ�class
				   num:140 //���ֵ������Ŀ
				} 
			$("."+txtobj.textareaName).on("focus",function(){
				$b=$(this).parents("."+txtobj.divName).find("."+txtobj.numName); //��ȡ��ǰ������
				$par=$b.parent(); 
				$onthis=$(this); //��ȡ��ǰ��textarea
				$num = txtobj.num;
				var setNum=setInterval(function(){
					var strlen=0; //��ʼ���峤��Ϊ0
					var txtval = $.trim($onthis.val());
					for(var i=0;i<txtval.length;i++){
						if(isChinese(txtval.charAt(i))==true){
							strlen=strlen+2;//����Ϊ2���ַ�
						}else{
							strlen=strlen+1;//Ӣ��һ���ַ�
						}
					}
					strlen=Math.ceil(strlen/2);//��Ӣ����ӳ�2ȡ����
					if($num-strlen<0){
						$par.html('<span style="float:right;" id="textcount" class="num">����<b  style="color:red;font-weight:lighter;" class='+txtobj.numName+'>'+Math.abs($num-strlen)+'</b> ��</span>'); //��������ʽ
						$('#postreply').attr("disabled",true).removeClass("input2").addClass("input1");
					}
					else{
						$par.html('<span style="float:right" id="textcount" class="num">'+($num-strlen)+'</span>'); //����ʱ��
						$('#postreply').attr("disabled",false).removeClass("input1").addClass("input2");
					}
					$b.html($num-strlen); 
				},500);    
				function isChinese(str){  //�ж��ǲ�������
					var reCh=/[u00-uff]/;
					return !reCh.test(str);
				}
			});
		},
		
		_initFace : function(){
			$('#face').SinaEmotion($('.emotion'));
		}
	};
	return re; 
}()

/**
 *����ظ���tool
 *
 * @config.params {object}
 * @config.params.tid {string} ����id
 * @config.params.is_anonymity {string} �Ƿ�����
 * @config.params.rid {string} ����ظ�id�������ٻظ���
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.tool.topicReplyBox = function(){
	var re = function(config){
		var DEFAULT_CONFIG = {
		
		};
		
		var _this = this;
		var $container = $(config.container);
		this.container = $container;
		this._config = $.extend({}, DEFAULT_CONFIG, config);
		this.fnSuccess = config.fnSuccess;
		this.fnFailed = config.fnFailed;
		this.flag = true;
		this.init(config.fnSuccess,config.fnFailed);
	};
	
	re.prototype = {
		init : function(fnS,fnF){
			var p = {};
			p = this._config;
			var _this = this;
			var is_anonymous = p.params.is_anonymous;
			var html = _this._getHtml(is_anonymous);
			var config = {};
			config.html = html;
			config.fnSuccess = function(){
				_this._numLimit();
				_this._initFace();
                $('#postreply').unbind('click').click(function(){   //��Ҫ�Ķ�
				//$(document).unbind('click').on('click','#postreply',function(){
					var params = {};
					params.htid = p.params.tid;
					$('#anonymous').is(':checked')?params.anonymity = 0:params.anonymity = 1;
					params.content = $('#reply-content').val();
					if (params.content == '') {
						alert('�ظ����ݲ���Ϊ��');
						return false;
					}
					if(p.params.rid){
						params.rid = p.params.rid;
					}
					var m = {};
					m.params = params;
					m.fnSuccess = function(data){
						_this.flag = true;
						popup.remind(data.msg);
						layer.closeAll();
						fnS(data);
					};
					m.fnFailed = function(data){
						_this.flag = true;
						fnF(data);
						popup.remind(data.msg);
						if (data.status == '-2') {
							
						} else if (data.status == '-1') {
							layer.closeAll();
							login();
						}
					};
					
					if(_this.flag){
						_this.flag = false;
						bluemp.api.ReplyTopicBlock(m);
					}
					$(document).unbind('touchmove');
					
				})
			}
			config.fnFailed = function(){
				_this.flag = true;
			}
			new bluemp.tool.Dialog(config)
		},
		
		_getHtml : function(data){
			var 	html= '';
	        html+='<div class="huifutanchu">';
			html+='<div class="huifu-textarea">';
		    html+='<textarea style="width:100%;maxlength:140;" id="reply-content"  class="emotion chackTextarea"></textarea>';
			html+='</div><div class="huifu_sz"><span style="float:right" id="textcount" class="num">140</span></div>';
			html+='<ul class = "reply-ul"><li class="reply-ul_left"><span class="span2"><a href="javascript:void(0);" id="face"><img src="/Public/Home/Images/biaoqing-icon.jpg"></a></span></li>';
			if(data=='1'){
				html+='<li class="reply-ul_left"><h2><span><input type="checkbox" id="anonymous">�����ظ�</span></h2></li>';
			}
			html+='';
			html+='<li class="reply-ul_right"><div class="send-2btn" style="width:100%;"><div class="huifu_sz">';
			html+='<input type="button" class="input1" value="ȡ��" id="closelay">';
			html+='<input type="button" class="input2" value="����" id="postreply">';
			html+='</li>';
			html+='</div>';
			html+='</ul></div>';
			
			return html;
		},
		
		_numLimit : function(){
			var txtobj={
				   divName:"huifutanchu", //���������class
				   textareaName:"chackTextarea", //textarea��class
				   numName:"num", //���ֵ�class
				   num:140 //���ֵ������Ŀ
				} 
			$("."+txtobj.textareaName).on("focus",function(){
				$b=$(this).parents("."+txtobj.divName).find("."+txtobj.numName); //��ȡ��ǰ������
				$par=$b.parent(); 
				$onthis=$(this); //��ȡ��ǰ��textarea
				$num = txtobj.num;
				var setNum=setInterval(function(){
					var strlen=0; //��ʼ���峤��Ϊ0
					var txtval = $.trim($onthis.val());
					for(var i=0;i<txtval.length;i++){
						if(isChinese(txtval.charAt(i))==true){
							strlen=strlen+2;//����Ϊ2���ַ�
						}else{
							strlen=strlen+1;//Ӣ��һ���ַ�
						}
					}
					strlen=Math.ceil(strlen/2);//��Ӣ����ӳ�2ȡ����
					if($num-strlen<0){
						$par.html('<span style="float:right;" id="textcount" class="num">����<b  style="color:red;font-weight:lighter;" class='+txtobj.numName+'>'+Math.abs($num-strlen)+'</b> ��</span>'); //��������ʽ
						$('#postreply').attr("disabled",true).removeClass("input2").addClass("input1");
					}
					else{
						$par.html('<span style="float:right" id="textcount" class="num">'+($num-strlen)+'</span>'); //����ʱ��
						$('#postreply').attr("disabled",false).removeClass("input1").addClass("input2");
					}
					$b.html($num-strlen); 
				},500);    
				function isChinese(str){  //�ж��ǲ�������
					var reCh=/[u00-uff]/;
					return !reCh.test(str);
				}
			});
		},
		
		_initFace : function(){
			$('#face').SinaEmotion($('.emotion'));
		}
	};
	return re; 
}()
</script>

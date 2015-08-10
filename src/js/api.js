<script>

/**
 * ���»ظ�
 * @config {object} 
 * @config.params {object}
 * @config.params.aid {string} ����id
 * @config.params.anonymity {string} ��(1)��(0)����
 * @config.params.content {string} ��������
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.Reply = function() {
    var reply = function(config) {
        jsonAjax('/portal/newcomment', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
                layer.closeAll();
            } else {
            	config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}()

/**
 * ���»ظ� ģ�黯��
 * @config {object} 
 * @config.params {object}
 * @config.params.aid {string} ����id
 * @config.params.anonymity {string} ��(1)��(0)����
 * @config.params.content {string} ��������
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.blockReply = function() {
    var reply = function(config) {
        jsonAjax('/Interface/comment', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
                layer.closeAll();
            } else {
            	config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}()
/**
 * �ж���������Ƶ���Ƿ�֧������
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */

bluemp.api.IsAnonymity = function() {
    var clazz = function(config) {
        jsonAjax('/portal/com', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return clazz;
}()
/**
 * �ж��û��Ƿ񱻽���
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.Silenced = function() {
    var silenced = function(config) {
        jsonAjaxSyn('/Portal/comRole', {}, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return silenced;
}()

/**
 * 
 * ���»�������۵���
 * @config.params {Object} 
 * @config.params.type {String} 1������,!1������
 * @config.params.id {String} ���� id
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.Exellent = function() {
    var exellent = function(config) {
        var url = '';
        if (config.params.type == 1) {
            url = '/Portal/comlike';
        } else {
            url = '/Like/ajax';
        }
        var o = {};
        o.fnSuccess = function(dataR){
			jsonAjax(url, config.params, function(data) {
				if (data.status == '1') {
					config.fnSuccess(data);
				} else {
					config.fnFailed(data);
				}
			}, 'get');
		}
        o.fnFailed = function(dataR){
			popup.remind(dataR.info);
			return false;
		}
		bluemp.api.Silenced(o)
        

    }
    return exellent;
}()
/**
 * 
 * ���µ���
 * @config.params {Object} 
 * @config.params.id {String} ����id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */

bluemp.api.plugExellent = function() {
    var exellent = function(config) {
     	var o = {};
     	o.fnSuccess = function(dataR){
			jsonAjax('/Portal/praise', config.params, function(data) {
				if (data.status == '1') {
					config.fnSuccess(data);
				} else {
					config.fnFailed(data);
				}
			}, 'get');
		}
     	o.fnFailed = function(dataR){
			popup.remind(dataR.info);
			return false;
		}
		bluemp.api.Silenced(o)
        

    }
    return exellent;
}()


/**
 * 
 * ɾ����������
 *
 * @config.params {Object} 
 * @config.params.id {String} ����id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.api.DeleteReply = function() {
    var deleteReply = function(config) {
        jsonAjax('/Portal/commentdel', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return deleteReply;
}()

/**
 * ����ظ�/�������ۻظ�
 *
 * @config.params {Object} 
 * @config.params.htid {String} ����id 
 * @config.params.content {String} �ظ�����
 * @config.params.rid {String} �ظ�id�����ڻظ����˻ظ���
 * @config.params.anonymous {String} ��(1)��(0)����
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.ReplyTopic = function() {
    var reply = function(config) {
        jsonAjax('/Reply/post', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'post');
    }
    return reply;
}();

/**
 * ����ظ�/�������ۻظ�
 *
 * @config.params {Object} 
 * @config.params.htid {String} ����id 
 * @config.params.content {String} �ظ�����
 * @config.params.rid {String} �ظ�id�����ڻظ����˻ظ���
 * @config.params.anonymous {String} ��(0)��(1)����
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.ReplyTopicBlock = function() {
    var reply = function(config) {
        jsonAjax('/Interface/replypost', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'post');
    }
    return reply;
}();
/**
 * ���Ȿ����ö�
 *
 * @config.params {Object} 
 * @config.params.htid {String} ����id 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.topicTop = function() {
    var reply = function(config) {
        jsonAjax('/Forum/top', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}();

/**
 * ���Ȿ���ȡ���ö�
 *
 * @config.params {Object} 
 * @config.params.htid {String} ����id 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.topicCancelTop = function() {
    var reply = function(config) {
        jsonAjax('/Forum/untop', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}();

/**
 * ɾ������
 *
 * @config.params {Object} 
 * @config.params.id {String} ����id 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.deleteTopic = function() {
    var reply = function(config) {
        jsonAjax('/Forum/delete', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}();

/**
 * ɾ������ظ�
 * @config.params.id {String} �ظ�id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.DeleteReplyTopic = function() {
    var reply = function(config) {
        jsonAjax('/Reply/delete', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return reply;
}();

/**
 * 
 * ��������
 * @config.params.title {String} ����
 * @config.params.saveimg {Array} ͼƬurl
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.SubmitTopic = function() {
    var submitTopic = function(config) {
        jsonAjax('/Forum/publish', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'post');
    }
    return submitTopic;
}()


/**
 * 
 * Ƶ����ֹ����
 * @config.params.aid {String} ����id
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */

bluemp.api.noComment = function() {
    var noComment = function(config) {
        jsonAjax('/Portal/articlecom', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return noComment;
}()

/**
 * 
 * �ٲ�����ȡ�����б�
 *
 *
 * @config.params.cid {String} Ƶ��id
 * @config.params.page {String} ҳ��
 * @config.params.minid {String} ��ǰҳ��С����id
 * 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.api.GetArticleList = function() {
    var clazz = function(config) {
        jsonAjax('/Portal/newfluida', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return clazz;
}();

/**
 * 
 * ��ȡ���������б�
 *
 * @config.params.aid {String} Ƶ��id
 * @config.params.page {String} ҳ��
 * @config.params.minid {String} ��ǰҳ��С����id
 * 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.GetReply = function() {
    var getReply = function(config) {
        jsonAjax('/Portal/newfluidc', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return getReply;
}();






/**
 * 
 * ��ȡ������ҳ�����б�
 *
 * @config.params.id {String} ���id
 * @config.params.page {String} ҳ��
 * @config.params.type {String} ����,new����,hot����,pic��ͼ������ 
 * @config.params.minid {String} ��ǰҳ������Сid
 * 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 *
 */
bluemp.api.GetTopic = function() {
    var getReply = function(config) {
        jsonAjax('/Forum/newfluid', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return getReply;
}();
/**
 * 
 * ��ȡ��������ظ��б�
 * 
 * @config.params.id {String} ���id
 * @config.params.page {String} ҳ��
 * @config.params.maxid {String} ��ǰҳ�����������id����ȡ���£�
 * 
 * 
 * @config.fnSuccess {function} ����ɹ�callback
 * @config.fnFailed {function} ����ʧ��callback
 */
bluemp.api.GetReplyTopic = function() {
    var getReply = function(config) {
        jsonAjax('/Reply/newfluid', config.params, function(data) {
            if (data.status == '1') {
                config.fnSuccess(data);
            } else {
                config.fnFailed(data);
            }
        }, 'get');
    }
    return getReply;
}();
</script>
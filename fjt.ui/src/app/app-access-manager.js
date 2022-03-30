var AccessTokenManager = (function () {
    function pageInitExecution() {
        try {
            _allDynamicMessages = [];
            _globalSettingKeyValueList = [];

            return $.when(
                $.get(_configRootUrl + "alldynamicmessage/getAllModuleDynamicMessages"),
                $.get(_configRootUrl + "configurationsettings/getDefinedGlobalSettingKeyValues",
                    {
                        allKeys: _globalSettingAllKeys
                    }
                ),
                $.get(_configRootUrl + "alldynamicmessage/getAllCategoryDynamicMessages")
            ).then(function (dynamicMessagesResp, settingKeyValuesResp, dynamicMessageCateResp) {
                if (dynamicMessagesResp && dynamicMessagesResp[0].data && dynamicMessagesResp[0].data.dynamicMessageList) {
                    _allDynamicMessages = dynamicMessagesResp[0].data.dynamicMessageList;
                }
                else {
                    /* only for debug purpose - [S]*/
                    const tractActivityLog = getLocalStorageValue('tractActivityLog');
                    if (tractActivityLog && Array.isArray(tractActivityLog)) {
                        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: app-access-manager_1.' };
                        tractActivityLog.push(obj);
                        setLocalStorageValue('tractActivityLog', tractActivityLog);
                    }
                    /* [E]*/
                    localStorage.removeItem('loginuser');
                    return false;
                }
                if (dynamicMessageCateResp && dynamicMessageCateResp[0].data && dynamicMessageCateResp[0].data.dynamicMessageList) {
                    _allDynamicMessages.DYNAMIC_MESSAGE = _.assign(_allDynamicMessages.DYNAMIC_MESSAGE, dynamicMessageCateResp[0].data.dynamicMessageList);
                }
                else {
                    /* only for debug purpose - [S]*/
                    const tractActivityLog = getLocalStorageValue('tractActivityLog');
                    if (tractActivityLog && Array.isArray(tractActivityLog)) {
                        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: app-access-manager_2.' };
                        tractActivityLog.push(obj);
                        setLocalStorageValue('tractActivityLog', tractActivityLog);
                    }
                    /* [E]*/
                    localStorage.removeItem('loginuser');
                    return false;
                }

                if (settingKeyValuesResp && settingKeyValuesResp[0].data && settingKeyValuesResp[0].data.globalSettingKeyValues) {
                    // console.log('1 - app access manager');
                    _globalSettingKeyValueList = settingKeyValuesResp[0].data.globalSettingKeyValues;
                    return true;
                }
                else {
                    /* only for debug purpose - [S]*/
                    const tractActivityLog = getLocalStorageValue('tractActivityLog');
                    if (tractActivityLog && Array.isArray(tractActivityLog)) {
                        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: app-access-manager_3.' };
                        tractActivityLog.push(obj);
                        setLocalStorageValue('tractActivityLog', tractActivityLog);
                    }
                    /* [E]*/
                    localStorage.removeItem('loginuser');
                    return false;
                }
            }).catch((error) => {
                /* only for debug purpose - [S]*/
                const tractActivityLog = getLocalStorageValue('tractActivityLog');
                if (tractActivityLog && Array.isArray(tractActivityLog)) {
                    const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: app-access-manager_4.' };
                    const obj2 = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: JSON.stringify(error) };
                    tractActivityLog.push(obj);
                    tractActivityLog.push(obj2);
                    setLocalStorageValue('tractActivityLog', tractActivityLog);
                }
                /* [E]*/
                localStorage.removeItem('loginuser');
                // console.log("Exception: " + error);
                return false;
            });
        }
        catch (error) {
            /* only for debug purpose - [S]*/
            const tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
                const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: app-access-manager_5.' };
                tractActivityLog.push(obj);
                setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/
            localStorage.removeItem('loginuser');
            // console.log("Exception: " + error);
            return false;
        }
    }

    return {
        pageInitExecution: pageInitExecution
    }
})();

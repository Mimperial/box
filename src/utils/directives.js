// vue指令定义
import Vue from 'vue'
Vue.directive('bodyScroll', {
    bind: function (el, binding) {
        el.onscroll = function () {
            var scrollTop = el.scrollTop;
            var windowHeight = el.clientHeight;
            var scrollHeight = el.scrollHeight;
            if (scrollTop + windowHeight >= scrollHeight) {
                binding.value();
            }
        }
    }
})
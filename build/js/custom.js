(function ($) {
    "use strict";
    var mainApp = {
        creatRadioCustomEle: function (params) {

            //  初始化自拟定的单选框和复选框
            $('.radio-custom input').after('<i class="fa-li fa fa-lg">');
            $('.checkbox-custom input').after('<i class="fa-li fa fa-lg"></i>');
        },
        openModal: function(){
            $(".open-modal").click(function () {
                $("#myModal").modal("show");
            });
        },
        sideMenu: function () {
            $('#select').dropDownMenuSelect({fn:function(t){
                console.log(t.html())
            }});
            $('#select2').dropDownMenuSelect();
        },

    };
    $(document).ready(function () {
        mainApp.sideMenu();
        mainApp.openModal();
        mainApp.creatRadioCustomEle();
        // $('#layout-btn')
        //     .on('click', function () {
        //         if ($('body').hasClass('layout-boxed')) {
        //             $('body').removeClass('layout-boxed')
        //         } else {
        //             $('body').addClass('layout-boxed')
        //         };
        //         //mainApp.resizeWindow();
        //     })
    });
}(jQuery));
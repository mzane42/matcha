'use strict'
angular.module('bubblz.emails').controller 'EmailTemplateController',
  ($scope, $rootScope, $state, $timeout, Emails, functionsHelper, Applications, applications, email, $sce) ->
    vm = this

    vm.uids =
      app: $state.params.idApplication
      mail: $state.params.idManager

    vm.state = functionsHelper.state
    functionsHelper.load.off()

    if !(vm.template = email)
      vm.template =
        title: 'Email'
        email_template: 'extern_email'
        email_attr:
          font_button_color: '#78909C'
          background_panel_color: '#FFF'
          background_button_color: '#FFF'
          font_color: '#78909C'
          background_color: '#F1F4F8'
          #logo_url: ''
          logo_url: 'https://bubblz-v1-production.s3.amazonaws.com/system/images/5a996cc9734e09bd274913efdb5aeabf085cc682/original/5a996cc9734e09bd274913efdb5aeabf085cc682'
          logo_width: '35px;'
        content: $scope.emails.basics.email_templates.extern_email
  #$sce.trustAsHtml($scope.emails.basics.email_templates.extern_email)
    else
      delete vm.template.uid

    ###
    console.log(vm.template.content);
    $scope.html = vm.template.content;
    $scope.trustedHtml = $sce.trustAsHtml($scope.html);
    ###
    b = ["bold", "italic", "underline", 'color', "|", "align", "formatUL", 'paragraphFormat']
    vm.options =
      theme: 'dark'
      heightMax: 400
      toolbarButtons: b
      toolbarButtonsMD: b
      toolbarButtonsSM: b
      toolbarButtonsXS: b
      key: "LiyolcjH1G-7vc1=="

    ###
    $scope.checkUploadInput = (pict) ->
      if (if pict != null then pict.type.indexOf('image') else undefined) != -1
        if pict.size < 1500000
          $timeout ->
            fr = new FileReader
            fr.onload = (e) ->
              $timeout ->
                vm.template.email_attr.logo_url = e.target.result
              , 1000
            fr.readAsDataURL pict
        else
          $timeout ->
            console.log 'pict size to big'
      else
        $timeout ->
          console.log 'pict not img'
    ###

    vm.submit = ->
      if vm.template.title
        functionsHelper.load.on()
        Emails.editTemplate(vm.template, vm.uids).then (data)->
          functionsHelper.load.off()
          $scope.emails.templates[data.uid] = applications.add.mail(vm.uids.app, data)
          vm.state.emails.list(vm.uids.app)

    return vm


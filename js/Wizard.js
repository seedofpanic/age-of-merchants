var Wizard = Backbone.Model.extend({
	container: null,
	steps: null,
	currentStep: 1,
	initialize: function (){
		if (!(container && container.length > 0))
		{
			console.log('Error: Bad wizard container');
		}
		set({steps: container.find('.step')});
	},
	next: function (){
		set({currentStep: get('currentStep') + 1});
		steps.hide();
		steps.find('step' + get('currentStep')).show();
	},
	back: function (){
		set({currentStep: get('currentStep') + 1});
		steps.hide();
		steps.find('step' + get('currentStep')).show();
	}
})
var Wizard = Backbone.Model.extend({
	container: null,
	steps: null,
	currentStep: 1,
	initialize: function (){
		var container = this.get('container');
		if (!(container && container.length > 0))
		{
			console.log('Error: Bad wizard container');
		}
		this.set('steps', container.find('.step'));
		this.set('currentStep', 1);
		this.showStep();
	},
	showStep: function (){
		this.get('steps').hide();
		this.get('container').find('#step' + this.get('currentStep')).show();
	},
	next: function (){
		this.set('currentStep', this.get('currentStep') + 1);
		this.showStep();
	},
	back: function (){
		this.set('currentStep', this.get('currentStep') - 1);
		this.showStep();
	}
})
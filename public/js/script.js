$(document).ready(function(){

	setTimeout(function(){
		$('.alert-success').fadeOut(1000);
	}, 5000)

	$(window).scroll(function(){
		var scrolling = $(window).scrollTop();
		
		if(scrolling >= 15){
			$('.navbar-default').css('background', 'LightBlue');
			$('.navbar-brand').css('color', 'White');
			$('.navbar-nav > li > a').css('color', 'White');
		}else{
			$('.navbar-default').css('background', 'transparent');
			$('.navbar-brand').css('color', '#777');
			$('.navbar-nav > li > a').css('color', '#777');
		}
		
	});

	var user = $('#user').data('id');
	var image_user = $('img').data('user_id');
	if(user == image_user){
		$('#btn-delete').removeAttr('disabled');
	}

	$('#post-comment').hide();
	
	$('#btn-comment').click(function(){
		$('#post-comment').slideToggle(1000);
	});
	
	$('#btn-like').click(function(event){
		event.preventDefault();
		
		var imgId = $(this).data('id');
		
		$.post('/image/' + imgId + '/like').done(function(data){
			$('.likes-count').text(data.likes);
		});
	});
	
	$('#btn-delete').click(function(event){
		event.preventDefault();
		var $this = $(this);
		
		var imgId = $('#btn-like').data('id')
		
		var remove = confirm('Are you sure you want to delete this image?');
		
		if(remove){
			$.ajax({
				url:'/image/' + imgId,
				type:'DELETE'
			}).done(function(result){
				if(result){
					$this.find('i').removeClass('fa-times').addClass('fa-check');
					$this.removeClass('btn-danger').addClass('btn-success');
					$this.append('<span>&nbsp;&nbsp;Deleted!</span>');
					setTimeout(function(){
						location.href = '/';
					},2000);
				}
			});
		}
		
	});
});
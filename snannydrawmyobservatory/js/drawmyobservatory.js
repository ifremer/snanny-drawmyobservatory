$(document).ready(function() {
	$('#filenameTyped').val($('#fileName').val()+".moe");
	$('#birt-report').css('visibility', 'hidden');
	$('.myMenu > li').bind('mouseover', openSubMenu);
		$('.myMenu > li').bind('mouseout', closeSubMenu);
		$('#fromdevice').hover(function() {
			$(this).toggleClass( "file_button_container" );
			$(this).toggleClass( "file_button_container_withHover" );
			
			}, function() {
				$(this).removeClass( "file_button_container_withHover" );
				$(this).addClass( "file_button_container" );
				console.log(this);
			});
		
		function openSubMenu() {
				$(this).find('ul').css('visibility', 'visible');
		};
		
		function closeSubMenu() {
				$(this).find('ul').css('visibility', 'hidden');
		};
				
});
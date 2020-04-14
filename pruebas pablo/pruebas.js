onclick="registroUser()"

					$('#registro').on('click', function() {
					if ($('.registro input[type ="text", value=""]').length > 0) {
						registroUser();							
					}
					else {
						console.log('some fields are empty!')
					}
					});
					
					
					$('#registro').on('click', function() {
						var empty = true;
						$('.registro input[type="text"]').each(function(){
						   if ($(this).val()!=""){
							  empty =false;
							  return false;
							}
						});
						if (!empty)
						{
							registroUser();
						}	
						else {
							console.log('some fields are empty!');
						}
					});	
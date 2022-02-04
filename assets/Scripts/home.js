// Choose new avatar
$("#chooseAvatarForm").submit(function(event) {
   event.preventDefault();

   let $form = $(this);
   let term = $form.find("input[name='avatar']:checked").val();
   let url = $form.attr("action");

   let posting = $.post(url, {
      avatar: term
   });

   posting.done(function(data) {
      document.querySelector(".menu-userimg").src = `Avatars/${term}.png`;
      callAlert("You successfully changed your avatar!");
   });
});
<script>
  const button = document.getElementById('color-toggle');

  button.addEventListener('click', () => {
    button.style.backgroundColor = '#25e625'; // green
  });
</script>


button.addEventListener('click', () => {
  const currentColor = button.style.backgroundColor;
  if (currentColor === 'rgb(230, 37, 37)') {
    button.style.backgroundColor = '#25e625'; // green
  } else {
    button.style.backgroundColor = '#e62525'; // red
  }
});

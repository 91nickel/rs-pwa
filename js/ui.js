document.addEventListener('DOMContentLoaded', () => {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});

  getPosts();
});

const getPosts = async () => {
  const loaderEl = document.getElementById('loader');
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
  const data = await response.json();
  const postsContainerEl = document.getElementById('posts');
  data.forEach(item => {
    postsContainerEl.insertAdjacentHTML('beforeend', postTemplate(item.id, item.title, item.body))
  });
  loaderEl.style.display = 'none';
};

const postTemplate = (id, name, body) => (`
  <div class="card-panel recipe white row" data-id="${id}">
    <img src="/img/post.png" alt="recipe thumb">
    <div class="recipe-details">
      <div class="recipe-title">${name}</div>
      <div class="recipe-ingredients">${body}</div>
    </div>
    <div class="recipe-delete">
      <i class="material-icons">delete_outline</i>
    </div>
  </div>
`);


import index from '../views/index.vue'
import info from '../views/info.vue'
import editor from '../views/editor.vue'
import add from '../views/add.vue'
import preview from '../views/preview.vue'
import share from '../views/fx.vue'

var routes = [{
    path: '/',
    redirect: '/Index'
}, {
    path: '/Index',
    name: 'index',
    component: index
}, {
    path: '/Info/:id',
    name: 'info',
    component: info
}, {
    path: '/Editor/:id',
    name: 'editor',
    component: editor
}, {
    path: '/Add',
    name: 'add',
    component: add
},{
    path: '/Preview/:id',
    name: 'preview',
    component: preview
},{
    path: '/Share/:id',
    name: 'share',
    component: share
}]

export default routes
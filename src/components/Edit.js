import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import './edit.css'

class Edit extends Component{

    constructor(props) {
        super(props);
        let id_edited = this.props.match.params.id;

        let postlist = JSON.parse(localStorage.getItem('Posts'));
        const selected_post = postlist.filter((post) => post.id === parseInt(id_edited, 10));
        this.state = {id:id_edited, posts:[selected_post]};

        this.submitAction = this.submitAction.bind(this)

    }


    render() {
        let post = this.state.posts[0];
        return (
            <div className='bgcolor'>
            <form className='form' onSubmit={() => this.submitAction()} method='get'>
                <div className='form-header'><h4>EDIT POST</h4> </div>
                      <div className='form-body'>
                                <label className='label_fields' htmlFor='title_input'>Title   </label>
                                <input className='input_fields' type='text' id='title_input' placeholder='Title' defaultValue={post[0].title}/>
                                <br/>
                                <label className='label_fields' htmlFor='body_input'>Body     </label>
                                <input className='input_fields' type='text' id='body_input' placeholder='Body' defaultValue={post[0].body}/>
                                <br/>
                                <button type='submit' className='button right'>Submit</button>
                      </div>

            </form>
            </div>
            )

        }


    submitAction()
    {
        let newtitle = document.getElementById('title_input').value;
        let newbody = document.getElementById('body_input').value;
        let post = this.state.posts[0][0];

        if (newtitle !== post.title || newbody !== post.body) {
            axios.put('https://jsonplaceholder.typicode.com/posts/' + post.id,
                {
                    userId: post.userId,
                    id: post.id,
                    title: newtitle,
                    body: newbody
                }).then(response => {console.log(response)});

            //edit in localstorage
            let localposts = JSON.parse(localStorage.getItem('Posts'));

            localposts.some((el,i) => {
                if (el.id===post.id) {
                localposts[i] = {id:post.id, userId:post.userId, title:newtitle, body:newbody };
                return true;
                }
                return false
            });

            localStorage.setItem('Posts', JSON.stringify(localposts));
            console.log('Changed');
            window.alert('Item changed');

        }
        else {
            console.log('No change in either');
            window.alert('No change')
            }



    }


}

export default withRouter(Edit)


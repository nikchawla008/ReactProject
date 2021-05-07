import React, {Component} from 'react';
import './getPosts.css'
import {Link, withRouter} from 'react-router-dom'
import axios from 'axios';





class GetPosts extends Component{

    constructor(props) {
        super(props);
        this.state = {error:null, isLoaded:false, filtered_posts:[] };
        this.delPost = this.delPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchAgain = this.fetchAgain.bind(this);
        this.addPost = this.addPost.bind(this);
    }


    // Loading the posts using fetch

    componentDidMount() {
        let postslist = JSON.parse(localStorage.getItem('Posts'));
        if ( postslist===null || postslist.length === 0){
            axios.get('https://jsonplaceholder.typicode.com/posts')
                .then((response => {this.setState({filtered_posts:response.data});
                localStorage.setItem('Posts', JSON.stringify(response.data));
                }));
        }
        else {
            this.setState({filtered_posts:postslist});
        }
    }


    render() {
        let posts = this.state.filtered_posts;
            return (
                <div className='page'>
                    <h1 align='center'>POSTS</h1>
                    <div>
                    <input type='text' onChange={this.handleChange} className='searchbar' placeholder='Enter Search Text'/>
                    <button className='button right' onClick={()=>this.fetchAgain()}>Refetch Posts from REST API</button>
                    <br /> <br/>
                    </div>
                    <div>
                        <input type='text' className='searchbar padded'  placeholder='New Post Title' id='newposttitle'/>
                        <input type='text' className='searchbar padded' placeholder='New Post Body' id='newpostbody'/>
                        <input type='text' className='searchbar padded' placeholder='New Post UserId' id='newpostuser'/>
                        <button className='button' onClick={()=> this.addPost()}>Submit</button>
                    </div>
                        <ul>
                        {posts.map(post => (<li key={post.id}>
                            <div className='rounded_border'>
                                <p className='posttitle'>{post.title}</p>
                                <p className='postbody'>{post.body}</p>
                                <Link  className='button' to={{pathname: '/edit/' + post.id}}>Edit</Link>
                                <button className='button' onClick={() => this.delPost(post)}> Delete</button>
                            </div>
                        </li>))

                        }
                    </ul>
                </div>
            )


    }

        handleChange(e){
            let posts = JSON.parse(localStorage.getItem('Posts'));
            // Variable to hold the filtered list before putting into state
            let newList;
            let currentList = posts;
            // If the search bar isn't empty
            if (e.target.value !== "") {
            // Assign the original list to currentList
            newList = currentList.filter(
                (post) => {const lc = post.title.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
            }
            else{
                newList = currentList;
            }

            localStorage.setItem('Posts', JSON.stringify(posts));
            this.setState({filtered_posts:newList})


    }

    delPost(item){
        //axios api call
        const id_deleted = item.id;
        axios.delete('https://jsonplaceholder.typicode.com/posts/' + id_deleted)
            .then(res=>console.log(res));

        //local storage delete
        //fetch from localstorage
        let posts = JSON.parse(localStorage.getItem('Posts'));

        //perform delete in local storage
        posts.some((el,i) => {
            if (el.id===item.id) {
                posts.splice(i,1);
                return true;
            }
            return false
        });

        //update local storage
        localStorage.setItem('Posts', JSON.stringify(posts));

        //update local posts state
        this.setState({filtered_posts:posts})
    }


    fetchAgain(){
        axios.get('https://jsonplaceholder.typicode.com/posts')
                .then((response => {this.setState({posts:response.data, filtered_posts:response.data});
                localStorage.setItem('Posts', JSON.stringify(response.data))}));
    }


    addPost()
    {
        let new_title = document.getElementById('newposttitle').value;
        let new_body = document.getElementById('newpostbody').value;
        let new_user = document.getElementById('newpostuser').value;

        let current_posts = JSON.parse(localStorage.getItem('Posts'));

        let postlen = current_posts.length + 1;

        current_posts = [...current_posts, {id:postlen, userId:new_user, title:new_title, body:new_body}];

        localStorage.setItem('Posts', JSON.stringify(current_posts));
        this.setState({filtered_posts:current_posts});


        axios.post('https://jsonplaceholder.typicode.com/posts',
            {id:postlen, userId:new_user, title:new_title, body:new_body})
            .then((response)=>console.log(response))
            .catch((error)=> {console.log(error)});

        //resetting the input boxes
        document.getElementById('newposttitle').value = '';
        document.getElementById('newpostbody').value = '';
        document.getElementById('newpostuser').value = '';
        window.alert('Post added')

    }


}
export default withRouter(GetPosts);
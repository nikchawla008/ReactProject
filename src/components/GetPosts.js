import React, {Component} from 'react';
import './getPosts.css'
import {Link, withRouter} from 'react-router-dom'
import axios from 'axios';





class GetPosts extends Component{

    constructor(props) {
        super(props);
        this.state = {error:null, posts : [], isLoaded:false, filtered_posts:[] };
        this.delPost = this.delPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchAgain = this.fetchAgain.bind(this);
    }


    // Loading the posts using fetch

    componentDidMount() {
        let postslist = JSON.parse(localStorage.getItem('Posts'));
        if ( postslist===null || postslist.length === 0){
            axios.get('https://jsonplaceholder.typicode.com/posts')
                .then((response => {this.setState({posts:response.data, filtered_posts:response.data});
                localStorage.setItem('Posts', JSON.stringify(response.data));
                }));
        }
        else {
            this.setState({posts:postslist, filtered_posts:postslist});
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
        //this.setState({posts:posts})
        this.setState({filtered_posts:posts})
    }


    fetchAgain(){
        axios.get('https://jsonplaceholder.typicode.com/posts')
                .then((response => {this.setState({posts:response.data, filtered_posts:response.data});
                localStorage.setItem('Posts', JSON.stringify(response.data))}));
    }



}
export default withRouter(GetPosts);
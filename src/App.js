import React, {useEffect} from 'react';
import './styles/App.css'
import { useState} from "react";
import PostList from "./components/PostList";
import PostForm from "./components/UI/PostForm";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/modal/MyModal";
import MyButton from "./components/UI/button/MyButton";
import PostServise from "./API/PostServise";
import Loader from "./components/UI/loader/Loader";
import {useFetching} from "./hooks/useFetching";
import {usePosts} from "./hooks/usePost";
import {getPagesCount} from "./utilits/pages";

function App() {

    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);

    const [totalCountPages, setTotalCountPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1)

    const  sortedAndSearchedPost = usePosts( posts, filter.sort, filter.query );

    const [fetchPosts, isPostLoading, postError] = useFetching(async () => {
        const response = await PostServise.getAll(limit, page);
        setPosts(response.data);
        const totalCount = (response.headers['x-total-count']);
        setTotalCountPages(getPagesCount(totalCount, limit));
    })

    useEffect(() => {
        fetchPosts()
    }, []);


    const createPost = (newPost) => {
      setPosts([...posts, newPost])
        setModal(false);
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    return (
        <div className='app'>
            <MyButton style={{margin: '20px 0 0 0'}} onClick={() => setModal(true)}>Create post</MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin:'15px 0 10px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError &&
                <h1 style={{textAlign:'center', marginTop:'50px'}}>Error occur: {postError}</h1>
            }
            {isPostLoading
                ? <div style={{ display:'flex', justifyContent:'center' }}>
                    <Loader />
                  </div>
                : <PostList remove={removePost} posts={ sortedAndSearchedPost } title={'Posts About JS'}/>
            }
        </div>
    )
}
export default App;
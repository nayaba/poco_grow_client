import React, { useState, useEffect, Fragment } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import SolidButton from '../shared/SolidButton'
import OutlineButton from '../shared/OutlineButton'
import messages from './../AutoDismissAlert/messages'

const ShowPrompt = (props) => {
  const [prompt, setPrompt] = useState([])
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    const { match, user } = props
    console.log('user: ', user)
    axios({
      url: `${apiUrl}/prompt/${match.params.id}`,
      headers: {
        'Authorization': `Token ${user.token}`
      }
    })
      .then(res => {
        setPrompt(res.data.prompt)
      })
      .then()
      .then(() => props.msgAlert({
        heading: 'Successfully found prompt!',
        message: messages.promptShowSuccess,
        variant: 'success'
      }))
      .catch(() => props.msgAlert({
        heading: 'Failed to find prompt',
        message: messages.promptShowFailure,
        variant: 'danger'
      }))
  }, [])

  const destroy = () => {
    const { match } = props
    axios({
      url: `${apiUrl}/prompt/${match.params.id}`,
      method: 'DELETE'
    })
      .then(() => setDeleted(true))
      .then(() => props.msgAlert({
        heading: 'Successfully deleted prompt!',
        message: messages.promptDeleteSuccess,
        variant: 'success'
      }))
      .catch(() => props.msgAlert({
        heading: 'Failed to delete prompt',
        message: messages.promptDeleteFailure,
        variant: 'danger'
      }))
  }

  if (!prompt) {
    return <p>Loading...</p>
  }

  // { pathname: '/prompts', state: { msg: 'Prompt successfully deleted!' } }
  if (deleted) {
    return <Redirect to='/prompt'/>
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-center row">
        <div className="display-4 title d-flex justify-content-center mt-3 col-12">
          <div className="mt-3 d-flex justify-content-center mt-3 col-12">
            <p>{prompt.content}</p>
          </div>
        </div>
        <SolidButton
          secondaryColor='White'
          onClick={destroy}
        >Delete Prompt</SolidButton>
        <Link to={`/prompt/${props.match.params.id}/edit`}>
          <OutlineButton
            primaryColor='#ffafcc'
            secondaryColor='White'
            className="ml-1"
          >Edit</OutlineButton>
        </Link>
        <div className="mt-3 d-flex justify-content-center mt-3 col-12">
          <Link to ="/prompt">Back to all prompts</Link>
        </div>
      </div>
    </Fragment>
  )
}

export default withRouter(ShowPrompt)

// <Fragment>
//   <p>{prompt.content}</p>
//   <button onClick={destroy}>Delete Prompt</button>
//   <Link to={`/prompt/${props.match.params.id}/edit`}>
//     <button>Edit</button>
//   </Link>
//   <Link to ="/prompt">Back to all prompts</Link>
// </Fragment>

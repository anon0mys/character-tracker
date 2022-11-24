import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'

const Home = () => {
    return (
        <>
            <Header size='large'>Welcome to Dungeon Tracker</Header>
            <Segment placeholder>
                <Grid columns={2} stackable textAlign='center'>
                    <Divider vertical>Or</Divider>

                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Header icon>
                                <Icon name='signup' />
                            </Header>
                            <Button as={Link} to='sign-up'>Sign Up</Button>
                        </Grid.Column>

                        <Grid.Column>
                            <Header icon>
                                <Icon name='sign-in' />
                            </Header>
                            <Button as={Link} to='login'>Log In</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </>
    )

}

export default Home
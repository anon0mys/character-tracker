import styled from 'styled-components';
import {
    border, compose, color, space, position,
    layout, typography, flexbox, grid
} from 'styled-system'

const Box = styled.div`
  ${compose(color, space, layout, position, border, typography)}
`

const Flex = styled(Box)`
  ${flexbox}
`

Flex.defaultProps = {
    display: 'flex',
}

const Grid = styled(Box)`
  ${grid}
`

Grid.defaultProps = {
    display: 'grid',
}

const GridItem = styled(Box)`
  ${grid}
`

export { Box, Flex, Grid, GridItem }
import styled from 'styled-components';
import {
    border, compose, color, space, position,
    layout, typography, flexbox
} from 'styled-system'

const Form = styled.form`
  ${compose(color, space, layout, position, border, typography, flexbox)}
`

Form.defaultProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '5%',
  minHeight: '250px'
}

const Select = styled.select`
  ${compose(color, space, layout, position, border, typography)}
`

export { Form, Select }
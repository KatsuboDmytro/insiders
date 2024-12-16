import { Button, ButtonGroup } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

export const Navigation: React.FC = (props: Props) => {
  const buttonStyle = {
    borderColor: 'black !important',
    color: 'black',
    width: '100%',
  }

  const buttons = [
    { key: 'one', to: '/', route: 'Statiscs' },
    { key: 'two', to: '/all-todos', route: 'All todos' },
  ];

  return (
    <aside className="nav">
      <ButtonGroup
        orientation="vertical"
        aria-label="Vertical button group"
        variant="text"
        sx={{
          width: 'inherit',
          marginBlock: '64px',
        }}
      >
        {buttons.map(({ key, to, route }) => (
          <Link to={to} key={key}>
            <Button sx={buttonStyle}>{route}</Button>
          </Link>
        ))}
      </ButtonGroup>
    </aside>
  )
}

import { Button, ButtonGroup } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export const Navigation: React.FC = () => {
  const buttonStyle = {
    borderColor: 'black !important',
    color: 'black',
    width: '100%',
  }

  const buttons = [
    { key: 'one', to: '/', route: 'Statiscs' },
    { key: 'two', to: '/list', route: 'All lists' },
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

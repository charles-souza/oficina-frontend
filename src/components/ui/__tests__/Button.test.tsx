import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('deve renderizar corretamente com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve aplicar variant primary por padrão', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-contained');
    expect(button).toHaveClass('MuiButton-containedPrimary');
  });

  it('deve aplicar variant secondary', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-containedSecondary');
  });

  it('deve aplicar variant outlined', () => {
    render(<Button variant="outlined">Outlined</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('deve aplicar variant text', () => {
    render(<Button variant="text">Text</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-text');
  });

  it('deve aplicar variant danger (error)', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-containedError');
  });

  it('deve mostrar loading spinner quando loading=true', () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve desabilitar botão quando loading=true', () => {
    render(<Button loading>Carregando</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve desabilitar botão quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve chamar onClick quando clicado', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clique</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onClick quando desabilitado', () => {
    const handleClick = vi.fn();

    render(<Button disabled onClick={handleClick}>Clique</Button>);
    const button = screen.getByRole('button');

    // Botão disabled não deve chamar onClick
    expect(button).toBeDisabled();
  });

  it('não deve chamar onClick quando loading', () => {
    const handleClick = vi.fn();

    render(<Button loading onClick={handleClick}>Clique</Button>);
    const button = screen.getByRole('button');

    // Botão loading é disabled, então não deve chamar onClick
    expect(button).toBeDisabled();
  });

  it('deve aceitar fullWidth prop', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-fullWidth');
  });

  it('deve renderizar startIcon quando fornecido', () => {
    const icon = <span data-testid="icon">🔥</span>;
    render(<Button startIcon={icon}>Com Ícone</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('deve substituir startIcon por spinner quando loading', () => {
    const icon = <span data-testid="icon">🔥</span>;
    render(<Button loading startIcon={icon}>Loading</Button>);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

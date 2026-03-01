import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('deve renderizar com status success', () => {
    render(<StatusBadge status="success" label="Concluído" />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('deve renderizar com status error', () => {
    render(<StatusBadge status="error" label="Erro" />);
    const chip = screen.getByText('Erro').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorError');
  });

  it('deve renderizar com status warning', () => {
    render(<StatusBadge status="warning" label="Atenção" />);
    const chip = screen.getByText('Atenção').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorWarning');
  });

  it('deve renderizar com status info', () => {
    render(<StatusBadge status="info" label="Informação" />);
    const chip = screen.getByText('Informação').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorInfo');
  });

  it('deve renderizar com status pending', () => {
    render(<StatusBadge status="pending" label="Pendente" />);
    const chip = screen.getByText('Pendente').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorDefault');
  });

  it('deve mostrar ícone por padrão', () => {
    const { container } = render(<StatusBadge status="success" label="OK" />);
    const icon = container.querySelector('.MuiChip-icon');
    expect(icon).toBeInTheDocument();
  });

  it('deve ocultar ícone quando showIcon=false', () => {
    const { container } = render(
      <StatusBadge status="success" label="OK" showIcon={false} />
    );
    const icon = container.querySelector('.MuiChip-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('deve renderizar tamanho small', () => {
    render(<StatusBadge status="info" label="Info" />);
    const chip = screen.getByText('Info').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-sizeSmall');
  });

  it('deve renderizar diferentes labels', () => {
    const { rerender } = render(<StatusBadge status="success" label="Label 1" />);
    expect(screen.getByText('Label 1')).toBeInTheDocument();

    rerender(<StatusBadge status="success" label="Label 2" />);
    expect(screen.getByText('Label 2')).toBeInTheDocument();
  });
});

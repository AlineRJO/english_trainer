import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve ser instanciado corretamente', () => {
    expect(service).toBeTruthy();
    expect(service.json_card_storage).toBe('cards');
  });

  describe('Métodos CRUD', () => {
    it('create: deve criar um novo registro com id único e persistir no localStorage', () => {
      const card = { front: 'Hello', back: 'Olá' };
      const created = service.create(card);

      expect(created).toBeTruthy();
      expect(created.id).toBeDefined();
      expect(created.front).toBe('Hello');
      expect(created.back).toBe('Olá');

      const raw = localStorage.getItem(service.json_card_storage);
      const parsed = JSON.parse(raw || '[]');
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(created.id);
      expect(parsed[0].front).toBe('Hello');
    });

    it('create: deve permitir criar registro em uma chave customizada', () => {
      const customKey = 'custom_cards';
      const card = { front: 'Apple', back: 'Maçã' };
      const created = service.create(card, customKey);

      expect(created).toBeTruthy();
      expect(created.id).toBeDefined();

      const defaultStorage = service.read();
      const customStorage = service.read(customKey);

      expect(defaultStorage.length).toBe(0);
      expect(customStorage.length).toBe(1);
      expect(customStorage[0].front).toBe('Apple');
    });

    it('read: deve retornar array vazio quando a chave não existir', () => {
      const result = service.read();
      expect(result).toEqual([]);
    });

    it('read: deve retornar todos os registros salvos sob a chave', () => {
      const card1 = service.create({ front: 'Dog', back: 'Cachorro' });
      const card2 = service.create({ front: 'Cat', back: 'Gato' });

      const records = service.read();
      expect(records.length).toBe(2);
      expect(records[0].id).toBe(card1.id);
      expect(records[1].id).toBe(card2.id);
    });

    it('update: deve localizar e atualizar o registro pelo id', () => {
      const created = service.create({ front: 'Book', back: 'Livr' });
      const updated = service.update(created.id, { back: 'Livro' });

      expect(updated).toBeTruthy();
      expect(updated.id).toBe(created.id);
      expect(updated.front).toBe('Book');
      expect(updated.back).toBe('Livro');

      const records = service.read();
      expect(records.length).toBe(1);
      expect(records[0].back).toBe('Livro');
    });

    it('update: deve retornar null caso o id não seja encontrado', () => {
      service.create({ front: 'Water', back: 'Água' });
      const updated = service.update('id-inexistente', { back: 'Água mineral' });

      expect(updated).toBeNull();
    });

    it('delete: deve remover o registro pelo id e atualizar o localStorage', () => {
      const card1 = service.create({ front: 'Sun', back: 'Sol' });
      const card2 = service.create({ front: 'Moon', back: 'Lua' });

      const deleted = service.delete(card1.id);
      expect(deleted).toBe(true);

      const records = service.read();
      expect(records.length).toBe(1);
      expect(records[0].id).toBe(card2.id);
    });

    it('delete: deve retornar false ao tentar remover id inexistente', () => {
      service.create({ front: 'Star', back: 'Estrela' });
      const deleted = service.delete('id-inexistente');

      expect(deleted).toBe(false);
      expect(service.read().length).toBe(1);
    });
  });

  describe('Tratamento de erros e resiliência', () => {
    it('deve retornar array vazio e não quebrar quando o JSON estiver corrompido', () => {
      localStorage.setItem(service.json_card_storage, 'JSON-INVALIDO-{{{');
      const records = service.read();

      expect(records).toEqual([]);
    });

    it('deve retornar array vazio se os dados armazenados não forem um array', () => {
      localStorage.setItem(service.json_card_storage, JSON.stringify({ notAnArray: true }));
      const records = service.read();

      expect(records).toEqual([]);
    });
  });
});

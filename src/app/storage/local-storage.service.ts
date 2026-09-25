import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  json_card_storage: string = 'cards';

  /**
   * Cria um novo registro gerando um ID único e persistindo no localStorage.
   * @param data Dados do registro a ser inserido.
   * @param storageKey Chave de armazenamento (padrão: json_card_storage).
   * @returns O registro criado com ID ou null em caso de erro.
   */
  create(data: any, storageKey: string = this.json_card_storage): any {
    try {
      const items = this.getAll(storageKey);
      const id = this.generateId();
      const newItem =
        typeof data === 'object' && data !== null
          ? { ...data, id: data.id ?? id }
          : { value: data, id };

      items.push(newItem);
      this.saveAll(storageKey, items);
      return newItem;
    } catch (error) {
      console.error(`Erro ao criar registro na chave "${storageKey}":`, error);
      return null;
    }
  }

  /**
   * Retorna todos os registros salvos sob a chave informada.
   * @param storageKey Chave de armazenamento (padrão: json_card_storage).
   * @returns Array de registros ou array vazio se não existir ou houver erro.
   */
  read(storageKey: string = this.json_card_storage): any[] {
    return this.getAll(storageKey);
  }

  /**
   * Localiza o registro pelo id, atualiza seus dados e regrava no localStorage.
   * @param id Identificador do registro a ser atualizado.
   * @param data Novos dados do registro.
   * @param storageKey Chave de armazenamento (padrão: json_card_storage).
   * @returns O registro atualizado ou null se não for encontrado ou ocorrer erro.
   */
  update(
    id: string | number,
    data: any,
    storageKey: string = this.json_card_storage
  ): any | null {
    try {
      const items = this.getAll(storageKey);
      const index = items.findIndex(
        (item: any) =>
          item && (item.id === id || String(item.id) === String(id))
      );

      if (index === -1) {
        console.warn(
          `Registro com id "${id}" não encontrado na chave "${storageKey}".`
        );
        return null;
      }

      const updatedItem =
        typeof data === 'object' && data !== null
          ? { ...items[index], ...data, id: items[index].id }
          : { ...items[index], value: data, id: items[index].id };

      items[index] = updatedItem;
      this.saveAll(storageKey, items);
      return updatedItem;
    } catch (error) {
      console.error(
        `Erro ao atualizar registro com id "${id}" na chave "${storageKey}":`,
        error
      );
      return null;
    }
  }

  /**
   * Remove o registro pelo id e regrava no localStorage.
   * @param id Identificador do registro a ser removido.
   * @param storageKey Chave de armazenamento (padrão: json_card_storage).
   * @returns true se o registro foi removido com sucesso, false caso contrário.
   */
  delete(
    id: string | number,
    storageKey: string = this.json_card_storage
  ): boolean {
    try {
      const items = this.getAll(storageKey);
      const initialLength = items.length;
      const filtered = items.filter(
        (item: any) =>
          !item || (item.id !== id && String(item.id) !== String(id))
      );

      if (filtered.length === initialLength) {
        console.warn(
          `Registro com id "${id}" não encontrado para exclusão na chave "${storageKey}".`
        );
        return false;
      }

      this.saveAll(storageKey, filtered);
      return true;
    } catch (error) {
      console.error(
        `Erro ao deletar registro com id "${id}" na chave "${storageKey}":`,
        error
      );
      return false;
    }
  }

  /**
   * Método auxiliar privado para buscar todos os registros e fazer o parse JSON com segurança.
   */
  private getAll(storageKey: string): any[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('window.localStorage não está disponível neste ambiente.');
        return [];
      }

      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        `Erro ao ler dados do localStorage para a chave "${storageKey}":`,
        error
      );
      return [];
    }
  }

  /**
   * Método auxiliar privado para persistir um array no localStorage com segurança.
   */
  private saveAll(storageKey: string, array: any[]): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('window.localStorage não está disponível neste ambiente.');
        return false;
      }

      window.localStorage.setItem(storageKey, JSON.stringify(array));
      return true;
    } catch (error) {
      console.error(
        `Erro ao salvar dados no localStorage para a chave "${storageKey}":`,
        error
      );
      return false;
    }
  }

  /**
   * Gera um id único utilizando crypto.randomUUID() ou Date.now().
   */
  private generateId(): string {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

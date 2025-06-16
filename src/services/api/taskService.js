import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        orderBy: [{
          FieldName: "created_at",
          SortType: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived']
      };

      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        where: [
          {
            FieldName: "category_id",
            Operator: "ExactMatch",
            Values: [categoryId]
          },
          {
            FieldName: "archived",
            Operator: "ExactMatch",
            Values: [false]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      throw error;
    }
  },

  async getActive() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        where: [
          {
            FieldName: "completed",
            Operator: "ExactMatch",
            Values: [false]
          },
          {
            FieldName: "archived",
            Operator: "ExactMatch",
            Values: [false]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching active tasks:", error);
      throw error;
    }
  },

  async getCompleted() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        where: [
          {
            FieldName: "completed",
            Operator: "ExactMatch",
            Values: [true]
          },
          {
            FieldName: "archived",
            Operator: "ExactMatch",
            Values: [false]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      throw error;
    }
  },

  async getArchived() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        where: [{
          FieldName: "archived",
          Operator: "ExactMatch",
          Values: [true]
        }]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          title: taskData.title,
          description: taskData.description || '',
          category_id: taskData.categoryId || 'general',
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
          archived: false
        }]
      };

      const response = await apperClient.createRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare update data with proper field names
      const updateRecord = {
        Id: parseInt(id, 10)
      };

      // Map field names and handle completion logic
      if (updateData.title !== undefined) updateRecord.title = updateData.title;
      if (updateData.description !== undefined) updateRecord.description = updateData.description;
      if (updateData.categoryId !== undefined) updateRecord.category_id = updateData.categoryId;
      if (updateData.priority !== undefined) updateRecord.priority = updateData.priority;
      if (updateData.dueDate !== undefined) updateRecord.due_date = updateData.dueDate;
      if (updateData.archived !== undefined) updateRecord.archived = updateData.archived;
      
      if (updateData.completed !== undefined) {
        updateRecord.completed = updateData.completed;
        if (updateData.completed) {
          updateRecord.completed_at = new Date().toISOString();
        } else {
          updateRecord.completed_at = null;
        }
      }

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async archive(id) {
    return this.update(id, { archived: true });
  },

  async unarchive(id) {
    return this.update(id, { archived: false });
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'archived'],
        whereGroups: [{
          operator: "AND",
          SubGroups: [{
            conditions: [{
              FieldName: "archived",
              Operator: "ExactMatch",
              Values: [false]
            }],
            operator: ""
          }, {
            conditions: [{
              FieldName: "title",
              Operator: "Contains",
              Values: [query]
            }],
            operator: "OR"
          }, {
            conditions: [{
              FieldName: "description",
              Operator: "Contains",
              Values: [query]
            }],
            operator: ""
          }]
        }]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  },

  async getStats() {
    try {
      const activeTasks = await this.getAll();
      const filtered = activeTasks.filter(t => !t.archived);
      const completed = filtered.filter(t => t.completed).length;
      const total = filtered.length;
      const today = new Date().toDateString();
      const todayCompleted = filtered.filter(t => 
        t.completed && t.completed_at && new Date(t.completed_at).toDateString() === today
      ).length;

      return {
        total,
        completed,
        pending: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        todayCompleted
      };
    } catch (error) {
      console.error("Error getting task stats:", error);
      throw error;
    }
  }
};

export default taskService;
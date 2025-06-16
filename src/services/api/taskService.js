import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async getByCategory(categoryId) {
    await delay(200);
    return tasks.filter(t => t.categoryId === categoryId && !t.archived);
  },

  async getActive() {
    await delay(200);
    return tasks.filter(t => !t.completed && !t.archived);
  },

  async getCompleted() {
    await delay(200);
    return tasks.filter(t => t.completed && !t.archived);
  },

  async getArchived() {
    await delay(200);
    return tasks.filter(t => t.archived);
  },

  async create(taskData) {
    await delay(300);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || 'general',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      archived: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      Id: tasks[index].Id // Prevent Id modification
    };
    
    // Handle completion logic
    if (updateData.completed && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (!updateData.completed && tasks[index].completed) {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = tasks.splice(index, 1)[0];
    return { ...deletedTask };
  },

  async archive(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], archived: true };
    return { ...tasks[index] };
  },

  async unarchive(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], archived: false };
    return { ...tasks[index] };
  },

  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return tasks.filter(t => 
      !t.archived && (
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
      )
    );
  },

  async getStats() {
    await delay(200);
    const activeTasks = tasks.filter(t => !t.archived);
    const completed = activeTasks.filter(t => t.completed).length;
    const total = activeTasks.length;
    const today = new Date().toDateString();
    const todayCompleted = activeTasks.filter(t => 
      t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
    ).length;
    
    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      todayCompleted
    };
  }
};

export default taskService;
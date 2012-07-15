class RenameColumnProjects < ActiveRecord::Migration
  def change
  	remove_column :projects, :status
  	add_column :projects, :current, :boolean, :default => true
  end
end
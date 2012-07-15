class ChangeColumnDefaultVisibility < ActiveRecord::Migration
  def change
  	change_column_default :projects, :visibility, true
  end
end
